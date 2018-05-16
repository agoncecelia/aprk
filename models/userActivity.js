var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true
};

var userActivitySchema = new mongoose.Schema({
    action: {
        type: String, required: true
    },
    userId: {
        type: String, required: true
    },
    userEmail: {
        type: String, required: true
    },
    affectedUserId: {
        type: String, required: true
    },
    affectedUserEmail: {
        type: String, required: true
    },
    userSnapshot: Object
}, schemaOptions)

module.exports = mongoose.model('UserActivity', userActivitySchema);