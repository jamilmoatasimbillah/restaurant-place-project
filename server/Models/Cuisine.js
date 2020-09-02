const mongoose = require('mongoose');

const CuisineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cuisine: {type: Number, required: true}
})

module.exports = mongoose.model('Cuisine', CuisineSchema);