const mongoose = require('mongoose');

const MealTypeSchema = new mongoose.Schema({
    name: {type: String,required: true},

    mealtype: {type: Number,required: true},
    thumb: {type: String,required: true}
})

module.exports = mongoose.model('MealType', MealTypeSchema);