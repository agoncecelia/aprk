var Document = require('../models/document');


//Below are listed the functions for performing the CRUD operations to the database for documents
module.exports = {
    find: function (params, callback) {
        Document.find(params, function (err, documents) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, documents);
        });
    },
    findById: function (id, callback) {
        Document.findById(id, function (err, document) {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, document);
        })
    },
    create: function (params, callback) {
        Document.create(params, function (err, document) {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, document)
        })
    },
    update: function (id, params, callback) {
        Document.findByIdAndUpdate(id, params, { new: true }, function (err, document) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, document);
        })
    },
    delete: function (id, callback) {
        Document.findById(id, function (err, res) {
            if (err) {
                callback(err, null);
            } else {
                res.delete(function (document) {
                    callback(null, document)
                });
                res.save();
            }
        });
    }
}