const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        maxlength: [300, 'Comment must be be a maximum of three hundred characters long']
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };