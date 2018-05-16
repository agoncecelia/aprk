var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    usePushEach: true
};

var departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    divisions: [{
        name: String
    }]
}, schemaOptions);

var Department = mongoose.model('Department', departmentSchema);
module.exports = Department;