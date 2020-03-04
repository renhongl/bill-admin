
const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    name: String,
});

const University = mongoose.model('University', UniversitySchema);

module.exports = University;