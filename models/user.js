var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: {type: String, unique: true, required: true},
  email: { type: String, unique: true, required: true},
  municipality: String,
  department: String,
  division: String,
  role: String,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  gender: String,
  deleted: {
    type: Boolean, default: false
  },
  status: {
    type: String, default: 'active'
  },
  expires: Date
}, schemaOptions);

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.delete = function(callback) {
  this.deleted = true;
  callback(this);
}

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

var User = mongoose.model('User', userSchema);

module.exports = User;
