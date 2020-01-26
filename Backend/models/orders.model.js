const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Define user model schema
const orderSchema = new Schema({
    barcode: Number,
    orderId: { type: Number, required: true },
    itemName: String,
    unitPrice: Number,
    amount: Number,
    total: Number,
    date: { type: Date, default: Date.now },
}, {
    timestamps: true
});
const Order = mongoose.model('Orders', orderSchema);
module.exports = Order;