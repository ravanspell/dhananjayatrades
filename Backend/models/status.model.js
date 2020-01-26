const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Define user model schema
const statusSchema = new Schema({
    _id: String,
    gotPriceTotal: { type: Number, required: true },
    total: String,
    profit: Number,
}, {
    timestamps: true
});
const Status = mongoose.model('status', statusSchema);
module.exports = Status;