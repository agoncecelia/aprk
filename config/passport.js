var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var UserController = require('../controllers/user');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
		done(null, user);
	});

	// Deserializing user
	passport.deserializeUser((id, done) => {
		User.findOne(id, (err, user) => {
			done(err, user);
		});
  });
  
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, req.flash('message', 'Llogaria nuk ekziston!'));
      }
      if(user.status == 'inactive') {
        return done(null, false, req.flash('message', 'Llogaria nuk është aktive!'));
      }
      if(user.expires instanceof Date) {
        if(user.expires < new Date()) {
          user.expires = undefined;
          user.status = 'inactive'
          user.save();
          return done(null, false, req.flash('message', 'Llogaria nuk është aktive!'));
        }
      }
      user.comparePassword(password, function(err, isMatch) {
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, req.flash('message', 'Fjalëkalimi është gabim!'));
        }
      })
    })
  }
  ))
}