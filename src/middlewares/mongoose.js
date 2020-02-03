



const { DB_SERVER, DATA_BASE } = require('../config/mongodb.config');

module.exports = () => {
    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://${DB_SERVER}/${DATA_BASE}`, { useNewUrlParser: true, useUnifiedTopology: true });
};