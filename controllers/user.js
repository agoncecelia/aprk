var User = require('../models/user');
var jwt = require('jsonwebtoken');
var passport = require('passport');
// var config = require('../config/config')
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

//Below are listed the functions for performing CRUD operations to the database for user
module.exports = {
  find: function (params, callback) {
    User.find(params, function (err, users) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, users)
    });
  },

  findById: function (id, callback) {
    User.findById(id, function (err, user) {
      if (err) {
        callback(err, null);
        return;
      }
      
      callback(null, user);
    })
  },

  findByEmail: function (email, callback) {
    User.find({ email: email }, function (err, user) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, user);
    })
  },

  create: function (params, callback) {
    User.create(params, function (err, user) {
      if (err) {
        callback(err, null)
        return;
      }
      callback(null, user)
    })
  },

  update: function (id, params, callback) {
    User.findByIdAndUpdate(id, params, { new: true }, function (err, profile) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, profile);
    })
  },

  delete: function (id, callback) {
    User.findById(id, function(err, res) {
      if(err) {
        callback(err, null);
      } else {
        res.delete(function(user) {
          callback(null, user)
        });
        res.save();
      }
    });
  },

  /**
   * Login functionality, finds user by username and compares the password
   * then assigns a jwt token that will expire in 1 week
   * @param {string} username - Users username to find the user in db
   * @param {string} password - Users input password to compare it
   * @param {function} callback - Callback with @param error and @param user
   */
  // login: function (username, password, callback) {
  //   User.findOne({ username: username }, function (err, user) {
  //     if (err) {
  //       callback(err, null);
  //     }
  //     if (!user) {
  //       callback('Perdoruesi nuk u gjet', null);
  //     }
  //     if (user != null) {
  //       if(user.deleted == true) {
  //         callback('Perdorues i fshire', null)
  //       } else {
  //         user.comparePassword(password, function (err, isMatch) {
  //           if (err) {
  //             callback(err, null);
  //           }
  //           if (isMatch) {
  //             var token = jwt.sign(user.toObject(), config.jwtSecret, {
  //               expiresIn: 604800
  //             })
  //             callback(null, {
  //               token: 'JWT ' + token,
  //               user
  //             });
  //           } else {
  //             callback('Fjalëkalimi është gabim.', null);
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  /**
   * Function for changing password
   * @param {string} id - Accepts the id of the user
   * @param {string} oldPassword - Old password of the user that will be compared
   * @param {string} newPassword - New password to be set if oldPassword is correct
   * @param {function} callback - Callback function with @param error and @param user
   */
  changePassword: function(id, oldPassword, newPassword, callback) {
    User.findById(id, function(err, user) {
      if (err) {
        callback(err, null);
      }
      if (user == null) {
        callback('User not found', null);
      }
      user.comparePassword(oldPassword, function(err, isMatch) {
        if(isMatch) {
          user.password = newPassword;
          user.save(function(err, user) {
            if(err) {
              callback(err, null);
              return;
            }
            callback(null, user);
          })
        } else {
          callback('Fjalëkalimi i vjetër është gabim.', null);
        }
      })
    })
  },
  forgot: function (email, host, callback) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(16, function (err, buff) {
          var token = buff.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: email }, function (err, user) {
          if (user == null) {
            callback(true, null);
          } else {
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + 3600000; //Expires in 1 hour
            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      },
      function (token, user, done) {
        var transporter = nodemailer.createTransport({
          service: 'Mailgun',
          auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'support@aprk.rks-gov.net',
          subject: 'Rivendosja e fjalëkalimit për platformën e APRK-së',
          text: 'Ju keni pranuar këtë mesazh sepse ju (apo dikush tjetër) keni kërkuar të ndryshoni fjalëkalimin.\n\n' +
            'Ju lutemi klikoni në linkun e mëposhtem apo kopjo linkun në shfletuesin tuaj:\n\n' +
            'http://' + host + '/user/reset/' + token + '\n\n' +
            'Nëse ju nuk e keni kërkuar këtë email ju lutemi ta injoroni, fjalëkalimi do të mbetet i njëjtë.\n'
        };
        transporter.sendMail(mailOptions, function (err) {
          callback(null, user);
        });
      }

    ])
  },
  resetPassword: function (passwordResetToken, password, callback) {
    async.waterfall([
      function (done) {
        User.findOne({ passwordResetToken: passwordResetToken })
          .where('passwordResetExpires').gt(Date.now())
          .exec(function (err, user) {
            if (!user) {
              return callback(true, null);
            }
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            user.save(function (err) {
              done(err, user);
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
          from: 'support@yourdomain.com',
          to: user.email,
          subject: 'Fjalëkalimi është ndryshuar me sukses',
          text: 'Përshëndetje,\n\n' +
            'Ky është një email që konfirmon ndryshimin e fjalëkalimit për ' + user.email + '\n'
        };
        transporter.sendMail(mailOptions, function (err) {
          callback(null, user);
        });
      }
    ]);
  }
}
