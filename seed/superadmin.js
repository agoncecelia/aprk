var mongoose = require('mongoose');
var User = require('../models/user');
var path = require('path')

require('dotenv').config();

mongoose.Promise = global.Promise;
console.log(process.env.DB_URL);

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to db for seeding');
    }).catch( err => {
        console.log('Error while connecting to db for seeding: ' + err);
    })

var superadmin = {
    firstName: 'Superadmin',
    lastName: 'Superadmin',
    username: 'superadmin',
    email: 'superadmin@gmail.com',
    municipality: 'Gjakova',
    department: 'Departamenti për Financa dhe Shërbime të Përgjithshme',
    division: 'Divizioni i TI dhe shërbimeve logjistike',
    role: 'superadmin',
    password: '100123456',
    deleted: false
}

User.create(superadmin, (err, user) => {
    if(err){
        console.log('Something went wrong, user may already exist')
        process.exit();
    } else {
        console.log('Superadmin successfuly created');
        process.exit();
    }
})