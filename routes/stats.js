var express = require('express');
var router = express.Router();
var authorization = require('../config/authorization');
var isAuthenticated = require('../common/isAuthenticated');
var Document = require('../models/document');

router.get('/documents-created-at', function (req, res, next) {
    Document.aggregate(
        [{
            $group: {
                _id: {
                    day: {
                        $dayOfMonth: "$createdAt"
                    },
                    month: {
                        $month: "$createdAt"
                    },
                    year: {
                        $year: "$createdAt"
                    }
                },
                sum: {
                    "$sum": 1
                }
            }
        }],
        function (err, data) {

            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: data
                });
            }
        }
    )
})


// Kontrolleri qe filtron sipas komunes, divizionit, departamentit per nje dokument(i pa-perfunduar)
router.get('/for-regular-user', isAuthenticated, function (req, res, next) {
    Document.aggregate(
        [{
                $match: {
                    "municipality": req.user.municipality,
                    "department": req.user.department
                }
            },
            {
                $unwind: "$division"
            },
            {
                $group: {
                    _id: '$division',
                    y: {
                        "$sum": 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    y: 1
                }
            }
        ],
        function (err, data) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: data
                });
            }
        }
    )
})

router.get('/municipality', function (req, res, next) {
    Document.aggregate(
        [{
                $unwind: "$municipality"
            },
            {
                $group: {
                    _id: "$municipality",
                    y: {
                        $sum: 1
                    },
                }
            },
            {
                $sort: {
                    y: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    y: 1
                }
            }
        ],
        function (err, data) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: data
                });
            }
        }
    )
})

router.get('/division', function (req, res, next) {
    Document.aggregate(
        [{
                $unwind: "$division"
            },
            {
                $group: {
                    _id: "$division",
                    y: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    y: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    y: 1
                }
            }
        ],
        function (err, data) {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            } else {
                res.json({
                    confirmation: 'success',
                    data: data
                });
            }
        }
    )
})

router.get('/department', function (req, res, next) {
    Document.aggregate([{
            $unwind: "$department"
        },
        {
            $group: {
                _id: "$department",
                y: {
                    $sum: 1
                },
            }
        },
        {
            $sort: {
                y: -1
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id",
                y: 1
            }
        }
    ], function (err, data) {
        if (err) {
            res.json({
                confirmation: 'fail',
                message: err.message
            })
        } else {
            res.json({
                confirmation: 'success',
                data: data
            });
        }
    })
})

module.exports = router;