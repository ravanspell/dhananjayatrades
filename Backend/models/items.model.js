const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
//Define user model schema
const itemsSchema = new Schema({

    _id: { type: String },
    name: { type: String, required: true },
    t: { type: Number, required: true },
    w: { type: Number, required: true },
    r: { type: Number, required: true },
    stock: { type: Number, required: true },
    company: { type: String },
    gotPrice: { type: Number, required: true }
}, {
    timestamps: true
});
const Items = mongoose.model('Items', itemsSchema);
module.exports = Items;