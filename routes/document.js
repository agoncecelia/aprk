var router = require('express').Router();
var DocumentController = require('../controllers/document');
var Document = require('../models/document');
var fs = require('fs');
var multer = require('multer');
var passport = require('passport');
var actions = require('../common/constants').actions;
var DocumentActivityController = require('../controllers/documentActivity');
var authorization = require('../config/authorization');
var path = require('path');
var nodemailer = require('nodemailer');
var isAuthenticated = require('../common/isAuthenticated');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/' + req.body.municipality);
    },
    filename: (req, file, cb) => {
        if (req.body.documentNumber == undefined) {
            DocumentController.findById(req.body.docId, function (err, result) {
                var answerNumber = result.answers.length + 1;
                var name = result.documentNumber + '-' + answerNumber;
                cb(null, name + path.extname(file.originalname))
            })
        } else {
            cb(null, req.body.documentNumber + path.extname(file.originalname));
        }
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (path.extname(file.originalname) !== '.pdf') {
            req.fileValidationError = 'Only pdfs are allowed'
            return cb(null, null);
        }
        cb(null, true)
    }
});


router.post('/check', function (req, res, next) {
    DocumentController.find({
        '$or': [
            {
                '$and': [
                    { 'documentTitle': new RegExp(req.body.documentTitle, "i") },
                    { 'origin': new RegExp(req.body.origin, "i") },
                    { 'addressed': new RegExp(req.body.addressed, "i") }
                ]
            },
            {
                '$and': [
                    { 'documentTitle': new RegExp(req.body.documentTitle, "i") },
                    { 'origin': new RegExp(req.body.origin, "i") },
                    { 'addressed': new RegExp(req.body.addressed, "i") },
                    { 'department': req.body.department }
                ]
            },
            {
                '$and': [
                    { 'documentTitle': new RegExp(req.body.documentTitle, "i") },
                    { 'addressed': new RegExp(req.body.addressed, "i") },
                    { 'department': req.body.department }
                ]
            },
            {
                '$and': [
                    { 'documentTitle': new RegExp(req.body.documentTitle, "i") },
                    { 'origin': new RegExp(req.body.origin, "i") },
                    { 'department': req.body.department }
                ]
            }

        ]
    }, function (err, response) {
        if (err) {
            res.json({
                confirmation: 'fail',
                message: err.message
            })
        } else {
            res.json({
                confirmation: 'success',
                data: response
            })
        }
    })
})

router.post('/', upload.single('file'), isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        if (req.fileValidationError) {
            res.json({
                confirmation: 'fail',
                message: 'Tipi i dokumentit duhet të jetë pdf.'
            })
        } else {
            var document = {
                user: {
                    id: req.user._id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    createdAt: Date.now()
                },
                documentNumber: req.body.documentNumber,
                documentTitle: req.body.documentTitle,
                municipality: req.body.municipality,
                origin: req.body.origin,
                addressed: req.body.addressed,
                dateOfDocumentArrival: req.body.dateOfDocumentArrival,
                documentDate: req.body.documentDate,
                through: req.body.through,
                receiver: req.body.receiver,
                dateOfDocumentIssued: req.body.dateOfDocumentIssued,
                physicalLocation: req.body.physicalLocation,
                department: req.body.department,
                division: req.body.division,
                comment: req.body.comment,
                documentFileName: req.file.filename
            }
            DocumentController.create(document, function (err, document) {
                if (err) {
                    res.json({
                        confirmation: 'fail',
                        message: 'Numri i lëndës duhet të jetë unik'
                    })
                } else {
                    var activity = {
                        action: actions.CREATE,
                        userId: req.user._id,
                        userEmail: req.user.email,
                        affectedDocumentId: document._id,
                        affectedDocumentTitle: document.documentTitle
                    }
                    DocumentActivityController.create(activity, function (err, activity) {
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
                        data: document
                    })
                }
            })
        }
    }
})


router.post('/send', isAuthenticated, function (req, res, next) {
    var document;

    var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
        }
    });

    DocumentController.findById(req.body.doc_id, (err, doc) => {
        if (err) {
            res.json({
                confirmation: 'fail',
                err: err.msg
            })
        } else {
            let mailOptions = {
                from: `${req.user.firstName} ${req.user.lastName} <${req.user.email}>`,
                to: req.body.email,
                subject: 'Dokumenti i skenuar: ' + doc.documentTitle,
                html: `Pershendetje i/e nderuar,<br> Te bashkangjitur gjeni dokumentin me titull <b>${doc.documentTitle}</b>.<br>Me respekt<br>${req.user.firstName} ${req.user.lastName}`,
                attachments: [{
                    path: 'public/uploads/' + doc.municipality + '/' + doc.documentFileName,
                }]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.json({
                        confirmation: 'fail',
                        message: 'Problem ne dergimin e emailit.'
                    })
                }
                res.json({
                    confirmation: 'success',
                    message: 'Emaili eshte derguar me sukses'
                });
            })
        }
    })

})

router.get('/:from/:to', isAuthenticated, function (req, res, next) {
    let query = {
        deleted: false,
        createdAt: {
            $gte: req.params.from,
            $lte: req.params.to,
        }
    }
    if (req.user.role == 'user') {
        query.department = req.user.department,
        query.division = req.user.division,
        query.municipality = req.user.municipality
    }
    if (authorization.checkPermission(req.user, ['user', 'admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'permission denied'
        })
    } else {
        DocumentController.find(query, function (err, documents) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: documents
                })
            }
        })
    }
})

router.get('/:id', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['user', 'admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DocumentController.findById(req.params.id, function (err, document) {
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
                    affectedDocumentId: document._id,
                    affectedDocumentTitle: document.documentTitle
                }
                DocumentActivityController.create(activity, function (err, activity) {
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
                    data: document
                })
            }
        })
    }
})

router.get('/:documentNumber/answer/:answerId', isAuthenticated, function (req, res, next) {
    DocumentController.find({ documentNumber: req.params.documentNumber }, function (err, results) {
        var result = results[0];
        if (err) {
            res.json({
                confirmation: 'fail',
                message: err.msg
            })
        } else {
            if (result.answers.length > 0) {
                for (var i = 0; i < result.answers.length; i++) {
                    if (result.answers[i]._id == req.params.answerId) {
                        res.json({
                            confirmation: 'success',
                            data: result.answers[i]
                        })
                        return;
                    }
                }
            } else {
                res.json({
                    confirmation: 'fail',
                    message: 'Document has no answers.'
                })
            }
        }
    })
})

router.post('/answer/:id', upload.single('file'), isAuthenticated, function (req, res, next) {
    var answer = {
        user: {
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            createdAt: Date.now()
        },
        answerTitle: req.body.answerTitle,
        municipality: req.body.municipality,
        origin: req.body.origin,
        addressed: req.body.addressed,
        dateOfAnswerArrival: req.body.dateOfAnswerArrival,
        answerDate: req.body.answerDate,
        through: req.body.through,
        receiver: req.body.receiver,
        dateOfAnswerIssued: req.body.dateOfAnswerIssued,
        physicalLocation: req.body.physicalLocation,
        department: req.body.department,
        division: req.body.division,
        comment: req.body.comment,
        answerFileName: req.file.filename,
        createdAt: Date.now()
    }
    DocumentController.findById(req.params.id, function (err, result) {
        var answerNumber = result.answers.length + 1;
        answer.answerNumber = result.documentNumber + '/' + answerNumber;
        result.answers.push(answer);
        result.save();
        res.json({
            confirmation: 'success',
            data: result.answers[result.answers.length - 1]
        });
    })
})

router.put('/:id', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        var document = {
            editingUser: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                createdAt: Date.now()
            },
            documentTitle: req.body.documentTitle,
            municipality: req.body.municipality,
            origin: req.body.origin,
            addressed: req.body.addressed,
            dateOfDocumentArrival: req.body.dateOfDocumentArrival,
            documentDate: req.body.documentDate,
            through: req.body.through,
            receiver: req.body.receiver,
            dateOfDocumentIssued: req.body.dateOfDocumentIssued,
            physicalLocation: req.body.physicalLocation,
            department: req.body.department,
            division: req.body.division,
            comment: req.body.comment,
        }
        var oldDocument;
        DocumentController.findById(req.params.id, function(err, result) {
            if(err){
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                oldDocument = result;
                oldDocument.answers = undefined;
                DocumentController.update(req.params.id, document, function (err, result) {
                    if (err) {
                        res.json({
                            confirmation: 'fail',
                            message: err.message
                        })
                    } else {
                        var activity = {
                            action: actions.UPDATE,
                            userId: req.user._id,
                            userEmail: req.user.email,
                            affectedDocumentId: result._id,
                            affectedDocumentTitle: result.documentTitle,
                            lastSnapshot: oldDocument
                        }
                        DocumentActivityController.create(activity, function (err, activity) {
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
                            message: 'Dokumenti eshte ndryshuar me sukses',
                            data: result
                        })
                    }
                })
            }
        })
    }
})

router.put('/:documentNumber/answer/:answerId', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DocumentController.find({documentNumber: req.params.documentNumber}, function (err, results) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                var result = results[0];
                var index;
                for (var i = 0; i < result.answers.length; i++) {
                    if (result.answers[i]._id == req.params.answerId) {
                        index = i;
                        result.answers[i].answerTitle = req.body.answerTitle;
                        result.answers[i].municipality = req.body.municipality;
                        result.answers[i].origin = req.body.origin;
                        result.answers[i].addressed = req.body.addressed;
                        result.answers[i].dateOfAnswerArrival = req.body.dateOfAnswerArrival;
                        result.answers[i].answerDate = req.body.answerDate;
                        result.answers[i].through = req.body.through;
                        result.answers[i].receiver = req.body.receiver;
                        result.answers[i].dateOfAnswerIssued = req.body.dateOfAnswerIssued;
                        result.answers[i].physicalLocation = req.body.physicalLocation;
                        result.answers[i].department = req.body.department;
                        result.answers[i].division = req.body.division;
                        result.answers[i].comment = req.body.comment;
                        result.answers[i].editingUser.id = req.user._id,
                        result.answers[i].editingUser.firstName = req.user.firstName,
                        result.answers[i].editingUser.lastName = req.user.lastName,
                        result.answers[i].editingUser.createdAt = Date.now()
                    }
                }
                result.save();
                res.json({
                    confirmation: 'success',
                    data: result.answers[index]
                })
            }
        })
    }
})

router.delete('/:id', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DocumentController.delete(req.params.id, function (err, resource) {
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
                    affectedDocumentId: resource._id,
                    affectedDocumentTitle: resource.documentTitle
                }
                DocumentActivityController.create(activity, function (err, activity) {
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
                    message: 'Dokumenti është fshirë me sukses.',
                    document: resource
                })
            }
        })
    }
})

router.delete('/:documentNumber/answer/:answerId', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        Document.findOneAndUpdate({documentNumber: req.params.documentNumber}, {
            $pull:
                { answers: { _id: req.params.answerId } }
        }, function (err, result) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: result
                })
            }
        })
    }
})

module.exports = router;
