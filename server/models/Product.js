const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        maxlength: [100, 'Product must be a maximum of one hundred characters long']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [70, 'Product must be a maximum of seventy characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        validate: {
            validator: (value) => value >= 0,
            message: 'Price must be a positive number'
        }
    },
    material: {
        type: String,
        required: [true, 'Material is required'],
        maxlength: [20, 'Material must be a maximum of twenty characters long']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\/[^ ]+$/gi, 'Image URL must start with http:// or https://'],
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };