const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CitySchema = new Schema({
    area: {type: String,required: true},
    city: {type: String,required: true},
    city_code: {type: Number,required: true},
    area_code: {type: Number,required: true},
    country: {type: String,required: true},
    country_code: {type: Number,required: true},
})

module.exports = mongoose.model('City', CitySchema);