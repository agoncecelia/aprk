var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true
};

var documentActivitySchema = new mongoose.Schema({
    action: {
        type: String, required: true
    },
    userId: {
        type: String, required: true
    },
    userEmail: {
        type: String, required: true
    },
    affectedDocumentId: {
        type: String, required: true
    },
    affectedDocumentTitle: {
        type:String, required: true
    },
    lastSnapshot: {
        type: Object
    }
}, schemaOptions)

module.exports = mongoose.model('DocumentActivity', documentActivitySchema);