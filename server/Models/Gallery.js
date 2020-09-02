const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    images: {type: [String], required: true},
    _restaurant: {type: String, required: true}
})



module.exports = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
