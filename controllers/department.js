var Department = require('../models/department');


//Below are listed the functions for performing the CRUD operations to the database for department
module.exports = {
    find: function (params, callback) {
        Department.find(params, function (err, departments) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, departments);
        });
    },
    findById: function (id, callback) {
        Department.findById(id, function (err, department) {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, department);
        })
    },
    create: function (params, callback) {
        Department.create(params, function (err, department) {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, department)
        })
    },
    update: function (id, params, callback) {
        Department.findByIdAndUpdate(id, params, { new: true, strict: false }, function (err, department) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, department);
        })
    },
    delete: function (id, callback) {
        Department.findByIdAndRemove(id, function(err, res) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        })
    }
}