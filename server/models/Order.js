const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addressDelivery: {
        type: String,
        required: [true, 'Order address is required'],
        maxlength: [100, 'Address must be a maximum of one hundred characters long']
    },
    orders: [{
        type: mongoose.Types.ObjectId,
        required: [true, 'Order is required'],
        ref: 'Product'
    }],
    date: {
        type: Number,
        required: true,
        default: Number(new Date().getTime().toString())
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };