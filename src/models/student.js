
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: String,
    password: String,
    mail: String,
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;