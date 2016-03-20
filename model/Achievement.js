const mongoose = require('mongoose');

const AchievementSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    content: {
        type: String,
        require: [true, 'content is required']
    }
});

module.exports = AchievementSchema;
