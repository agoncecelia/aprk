var DocumentActivity = require('../models/documentActivity');

// Create, find one or multiple activites
// Deleting or updating an activity is impossible from the controller.

module.exports = {

    //Get the list of user activity
    find: function (params, callback) {
        DocumentActivity.find(params, function (err, activities) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, activities)
        });
    },
    //Get a single activity
    findById: function (id, callback) {
        DocumentActivity.findById(id, function (err, activity) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, activity);
        })
    },
    //Create an activity
    create: function (params, callback) {
        DocumentActivity.create(params, function (err, activity) {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, activity)
        })
    }
}