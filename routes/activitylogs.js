var router = require('express').Router();
var passport = require('passport');
var UserController = require('../controllers/user');
var UserActivityController = require('../controllers/userActivity');
var DocumentActivityController = require('../controllers/documentActivity');
var LoginActivityController = require('../controllers/loginActivity');
var authorization = require('../config/authorization');
var UserActivity = require('../models/userActivity')
var LoginActivity = require('../models/loginActivity')
var DocumentActivity = require('../models/documentActivity')
var isAuthenticated = require('../common/isAuthenticated');


router.get('/:action/:from/:to', isAuthenticated, function (req, res, next) {

    
    if (req.params.action == 'user') {
        UserActivity.find({
            createdAt: {
                $gte: req.params.from,
                $lte: req.params.to
            }
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
    } else if (req.params.action == 'document') {
        DocumentActivity.find({
            createdAt: {
                $gte: req.params.from,
                $lte: req.params.to
            }
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
    } else if (req.params.action == 'session') {
        LoginActivity.find({
            createdAt: {
                $gte: req.params.from,
                $lte: req.params.to
            }
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
    } else if(req.params.action =='log') {
        if(req.params.from == 'document') {
            DocumentActivity.findById(req.params.to, function(err, response) {
                if(err) {
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
        } else if(req.params.from == 'user') {
            UserActivity.findById(req.params.to, function(err, response) {
                if(err) {
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
        }
    }
})


module.exports = router