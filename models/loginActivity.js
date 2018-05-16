var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true
};

var loginActivitySchema = new mongoose.Schema({
    action: {
        type: String, required: true
    },
    userId: {
        type: String, required: true
    },
    userEmail: {
        type: String, required: true
    }
}, schemaOptions)

module.exports = mongoose.model('LoginActivity', loginActivitySchema);