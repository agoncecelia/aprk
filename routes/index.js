var express = require('express');
var router = express.Router();
var authorization = require('../config/authorization');
var passport = require('passport');
var isAuthenticated = require('../common/isAuthenticated');

router.get('/', function(req, res) {
    if(req.user) {
        res.redirect('/dashboard')
    } else {
        res.render('home', {message: req.flash('message')});
    }
})

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/dashboard', isAuthenticated, function(req, res) {
    res.render('admin/adminlayout', {user: req.user});
})



module.exports = router;