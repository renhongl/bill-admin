
const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: String,
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;