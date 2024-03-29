const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Store name is required'],
        maxlength: [50, 'The store name must be a maximum of fifty characters long']
    },
    category: {
        type: String,
        required: [true, 'Store category is required'],
        maxlength: [50, 'Category must be a maximum of fifty characters long']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [200, 'Description must be a maximum of two hundred characters long']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\/[^ ]+$/gi, 'Image URL must start with http:// or https://'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Store owner is required']
    }
});

const Store = mongoose.model('Store', storeSchema);

module.exports = { Store };