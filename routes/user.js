var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user');
var passport = require('passport');
var authorization = require('../config/authorization');
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');
var actions = require('../common/constants').actions;
var UserActivityController = require('../controllers/userActivity');
var LoginActivityController = require('../controllers/loginActivity');
var isAuthenticated = require('../common/isAuthenticated');
var User = require('../models/user')

router.get('/profile', isAuthenticated, function (req, res, next) {
    res.json(req.user)
})

router.get('/:id', isAuthenticated, function (req, res, next) {
    UserController.findById(req.params.id, function (err, user) {
        if (err) {
            res.json({
                confirmation: 'fail',
                message: err.message
            })
        } else {
            var activity = {
                action: actions.READ,
                userId: req.user._id,
                userEmail: req.user.email,
                affectedUserId: user._id,
                affectedUserEmail: user.email
            }
            UserActivityController.create(activity, function (err, activity) {
                if (err) {
                    res.json({
                        confirmation: 'fail',
                        message: err.message
                    })
                    return;
                }
            })
            res.json({
                confirmation: 'success',
                user: user
            })
        }
    })
    // }
})

router.get('/', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        UserController.find({ deleted: false }, function (err, users) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: users
                })
            }
        })
    }
})

router.post('/register', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        UserController.create(req.body, function (err, result) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
                return
            }
            var activity = {
                action: actions.CREATE,
                userId: req.user._id,
                userEmail: req.user.email,
                affectedUserId: result._id,
                affectedUserEmail: result.email
            }
            UserActivityController.create(activity, function (err, activity) {
                if (err) {
                    res.json({
                        confirmation: 'fail',
                        message: err.message
                    })
                    return;
                }
            })
            res.json({
                confirmation: 'success',
                data: result
            });
        })
    }
})

router.post('/login', passport.authenticate('local-login',
    { failureRedirect: '/', failureFlash: true }),
    function (req, res, next) {
        res.redirect('/dashboard');
    })

router.post('/forgot', function (req, res, next) {
    var email = req.body.email;
    var host = req.headers.host
    UserController.forgot(email, host, function (err, user) {
        if (err) {
            res.json({
                confirmation: 'fail',
                message: 'Kjo email adresë ' + email + ' nuk ekziston në databazën tonë.'
            })
        } else {
            res.json({
                confirmation: 'success',
                message: 'Një email është dërguar në ' + email + ' me udhëzime të detajuara.'
            })
        }
    })
})
router.get('/reset/:token', function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function (err, user) {
            if (!user) {
                req.flash('error', { msg: 'Kërkesa për ndryshimin e fjalëkalimit ka skaduar ose është invalide.' });
                return res.redirect('/');
            }
            res.render('resetpassword', {
                title: 'Rivendosja e fjalëkalimit'
            });
        });
})
router.post('/reset/:token', function (req, res, next) {
    req.assert('password', 'Fjalëkalimi duhet të jetë së paku 6 karaktere i gjatë').len(6);
    req.assert('confirm', 'Fjalëkalimi duhet të jetë i njëjtë në të dy fushat').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        // req.flash('error', errors);
        req.flash('error', "fjasdlkajdsl");
        return res.redirect('back');
    }
    async.waterfall([
        function (done) {
            User.findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires').gt(Date.now())
                .exec(function (err, user) {
                    if (!user) {
                        req.flash('error', { msg: 'Kërkesa për ndryshimin e fjalëkalimit ka skaduar ose është invalide.' });
                        return res.redirect('back');
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save(function (err) {
                        req.logIn(user, function (err) {
                            done(err, user);
                        });
                    });
                });
        },
        function (user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD
                }
            });
            var mailOptions = {
                from: 'support@aprk.com',
                to: user.email,
                subject: 'Fjalëkalimi është ndryshuar me sukses',
                text: 'Përshëndetje,\n\n' +
                    'Ky është një email që konfirmon ndryshimin e fjalëkalimit për ' + user.email + '\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                req.flash('success', { msg: 'Fjalëkalimi juaj është ndryshuar me sukses.' });
                res.redirect('/dashboard');
            });
        }
    ]);
    // UserController.resetPassword(req.params.token, req.body.password, function (err, user) {
    //     if (err) {
    //         req.flash('error', { msg: 'Kërkesa për ndryshimin e fjalëkalimit ka skaduar ose është invalide.' });
    //         return res.redirect('back');
    //     } else {
    // req.logIn(user, function (err) {
    //     done(err, user);
    // });
    // var transporter = nodemailer.createTransport({
    //     service: 'Mailgun',
    //     auth: {
    //       user: process.env.MAILGUN_USERNAME,
    //       pass: process.env.MAILGUN_PASSWORD
    //     }
    //   });
    //   var mailOptions = {
    //     from: 'support@yourdomain.com',
    //     to: user.email,
    //     subject: 'Fjalëkalimi është ndryshuar me sukses',
    //     text: 'Përshëndetje,\n\n' +
    //       'Ky është një email që konfirmon ndryshimin e fjalëkalimit për ' + user.email + '\n'
    //   };
    //   transporter.sendMail(mailOptions, function (err) {
    //             req.flash('success', { msg: 'Fjalëkalimi juaj është ndryshuar me sukses.' });
    //             res.render('admin/adminlayout');
    //         // });
    //     }
    // })
})

router.put('/details', isAuthenticated, function (req, res, next) {
    UserController.update(req.user._id, req.body, function (err, user) {
        if (err) {
            res.json({
                confirmation: 'fail',
                message: 'Gabim në ndryshimin e të dhënave.'
            })
        } else {
            req.login(user, (err) => {
                if (err) {
                    res.json({
                        confirmation: 'fail',
                        message: err.message
                    })
                    return;
                }
            })
            res.json({
                confirmation: 'success',
                message: 'Ndryshimet u ruajtën me sukses.',
                user: user
            })
        }
    })
})

router.put('/update', isAuthenticated, function (req, res, next) {
    var body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        municipality: req.body.municipality,
        department: req.body.department,
        division: req.body.division,
        expires: req.body.expires,
        gender: req.body.gender,
        role: req.body.role,
        status: req.body.status
    }
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        UserController.findById(req.body.id, function (err, result) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                UserController.update(req.body.id, body, function (err, user) {
                    if (err) {
                        res.json({
                            confirmation: 'fail',
                            message: 'Gabim në ndryshimin e të dhënave.'
                        })
                    } else {
                        var activity = {
                            action: actions.UPDATE,
                            userId: req.user._id,
                            userEmail: req.user.email,
                            affectedUserId: user._id,
                            affectedUserEmail: user.email,
                            userSnapshot: result
                        }
                        UserActivityController.create(activity, function (err, activity) {
                            if (err) {
                                res.json({
                                    confirmation: 'fail',
                                    message: err.message
                                })
                                return;
                            }
                        })

                        res.json({
                            confirmation: 'success',
                            message: 'Ndryshimet u ruajtën me sukses.',
                            data: user
                        })
                    }
                })
            }
        })
    }
})


router.put('/password', isAuthenticated, function (req, res, next) {
    UserController.changePassword(req.user._id, req.body.oldPassword, req.body.newPassword, function (err, user) {
        if (err) {
            res.json({
                confirmation: 'fail',
                message: err
            })
        } else {
            req.login(user, (err) => {
                if (err) {
                    res.json({
                        confirmation: 'fail',
                        message: err.message
                    })
                    return;
                }
            })
            res.json({
                confirmation: 'success',
                message: 'Fjalëkalimi është ndryshuar me sukses.'
            })
        }
    })
})

router.delete('/:id', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        UserController.delete(req.params.id, function (err, user) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                var activity = {
                    action: actions.DELETE,
                    userId: req.user._id,
                    userEmail: req.user.email,
                    affectedUserId: user._id,
                    affectedUserEmail: user.email
                }
                UserActivityController.create(activity, function (err, activity) {
                    if (err) {
                        res.json({
                            confirmation: 'fail',
                            message: err.message
                        })
                        return;
                    }
                })
                res.json({
                    confirmation: 'success',
                    message: 'Përdoruesi është fshirë me sukses nga databaza',
                    user: user
                })
            }
        })
    }
})
module.exports = router;