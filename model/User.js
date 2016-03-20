const mongoose = require('mongoose');
const AchievementSchema = require('./Achievement');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: '{VALUE} is not a valid email address!'
        },
        required: [true, 'Email is required!']
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return v.length > 5;
            },
            message: '{VALUE} is too short! Six characters at least!'
        },
        required: [true, 'Password is required!']
    },
    achievements: [AchievementSchema]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
