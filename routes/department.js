var router = require('express').Router();
var DepartmentController = require('../controllers/department');
var authorization = require('../config/authorization');
var passport = require('passport');
var isAuthenticated = require('../common/isAuthenticated');


router.get('/', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['user', 'admin', 'superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.find({}, function (err, result) {
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

router.post('/', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.create(req.body, function (err, department) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: department
                })
            }
        })
    }
})

router.delete('/:id', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.delete(req.params.id, function (err, result) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confrimation: 'success',
                    data: result
                })
            }
        })
    }
})


router.put('/:id', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.update(req.params.id, req.body, function (err, result) {
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

router.put('/:id/division/:divisionId', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.findById(req.params.id, function (err, result) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                for (var i = 0; i < result.divisions.length; i++) {
                    if (result.divisions[i]._id == req.params.divisionId) {
                        result.divisions[i].name = req.body.name;
                    }
                }
                result.save();
                res.json({
                    confirmation: 'success',
                    data: result
                })
            }
        })
    }
})

router.post('/:id/division', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.findById(req.params.id, function (err, result) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                result.divisions.push(req.body)
                result.save();
                res.json({
                    confirmation: 'success',
                    data: result
                });
            }
        })
    }
})

router.delete('/:id', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.delete(req.params.id, function (err, result) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'succcess',
                    data: result
                })
            }
        })
    }
})

router.delete('/:id/division/:divisionId', isAuthenticated, function (req, res, next) {
    if (authorization.checkPermission(req.user, ['superadmin']) == false) {
        res.json({
            authorized: false,
            message: 'Permission denied'
        })
    } else {
        DepartmentController.update(req.params.id, {
            $pull:
                { divisions: { _id: req.params.divisionId } }

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