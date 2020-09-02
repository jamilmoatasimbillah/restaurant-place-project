const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: {type: String,required: true},
    city: {type: String, required: true},
    city_code: {type: Number, required: true},
    area: {type: String, required: true},
    area_code: {type: Number, required: true},
    country_code: {type: Number, required: true},
    thumb: {type: String, required: true},
    costfortwo: {type: Number, required: true},
    address: {type: String, required: true},
    mealtypes: {type: [ Number] , required: true},
    cuisines: {type: [ Number] , required: true},
    gallery: {type: Array, default: []},
    aggregate_rating: Number,
    contact: {type: String, required: true}
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);
