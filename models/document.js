var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    usePushEach: true
};

var documentSchema = new mongoose.Schema({
    user: {
        id: String,
        firstName: String,
        lastName: String,
        createdAt: Date
    },
    editingUser: {
        id: String,
        firstName: String,
        lastName: String,
        createdAt: Date
    },
    documentNumber: {
        type: String,
        required: true,
        unique: true
    },
    documentTitle: {
        type: String,
        required: true
    },
    municipality: String,
    origin: String,
    addressed: String,
    dateOfDocumentArrival: Date,
    documentDate: Date,
    through: String,
    receiver: String,
    dateOfDocumentIssued: Date,
    physicalLocation: String,
    department: String,
    division: String,
    comment: String,
    documentFileName: String,
    answers: [
        {
            user: {
                id: String,
                firstName: String,
                lastName: String,
                createdAt: Date
            },
            editingUser: {
                id: String,
                firstName: String,
                lastName: String,
                createdAt: Date
            },
            answerNumber: {
                type: String,
                required: true
            },
            answerTitle: {
                type: String,
                required: true
            },
            municipality: String,
            origin: String,
            addressed: String,
            dateOfAnswerArrival: Date,
            answerDate: Date,
            through: String,
            receiver: String,
            dateOfAnswerIssued: Date,
            physicalLocation: String,
            department: String,
            division: String,
            comment: String,
            answerFileName: String,
            deleted: {
                type: Boolean, default: false
            },
            createdAt: {
                type: Date, default: Date.now()
            }
        }
    ],
    deleted: {
        type: Boolean, default: false
    }
}, schemaOptions);


documentSchema.methods.delete = function (callback) {
    this.documentNumber = this.documentNumber + '-D' + (Math.floor(Math.random() * 1000) + 1) 
    this.deleted = true;
    callback(this);
}

var Document = mongoose.model('Document', documentSchema);
module.exports = Document;
