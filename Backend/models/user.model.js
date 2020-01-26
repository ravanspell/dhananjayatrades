const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Define user model schema
const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    admin: { type: Boolean, default: false },
    lastlogedin: Date
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
module.exports = User;