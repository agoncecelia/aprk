var LoginActivity = require('../models/loginActivity');

// Create, find one or multiple activites
// Deleting or updating an activity is impossible from the controller.

module.exports = {

    //Get the list of user activity
    find: function (params, callback) {
        LoginActivity.find(params, function (err, activities) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, activities)
        });
    },
    //Get a single activity
    findById: function (id, callback) {
        LoginActivity.findById(id, function (err, activity) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, activity);
        })
    },
    //Create an activity
    create: function (params, callback) {
        LoginActivity.create(params, function (err, activity) {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, activity)
        })
    }
}