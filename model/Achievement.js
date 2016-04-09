const mongoose = require('mongoose');

const AchievementSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
        minlength: 1,
        maxlength: 125
    },
    content: {
        type: String,
        required: [true, 'content is required'],
        minlength: 1,
        maxlength: 1000
    },
    done: {
        type: Boolean,
        required: [true, 'done status is required']
    }
});

module.exports = AchievementSchema;
