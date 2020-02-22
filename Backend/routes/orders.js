const router = require('express').Router();
const Order = require('../models/orders.model');
const Items = require('../models/items.model');
const Status = require('../models/status.model');

router.post('/add', async (req, res) => {
    let orderId = 0;
    if (!req.body.hasOwnProperty('orderNo')) {
        while (!Boolean(orderId)) {
            let orderid = Math.floor(Math.random() * 99999);
            let orders = await Status.find({ _id: orderid });
            if (orders.length < 1) {
                let orderitem = new Status({
                    _id: orderid,
                    gotPriceTotal: 0,
                    total: 0,
                    profit: 0
                });
                let orderStatus = await orderitem.save(orderitem)
                console.log(orderStatus);
                orderId = orderStatus._id;
                res.status(200).json({ status: true, response: orderStatus._id });
            }
        }
    } else {
        const { orderItems, orderNo, totalPrice, totalGotPrice } = req.body;
        try {
            await Promise.all([
                Order.insertMany(orderItems),
                reduceStrock(orderItems),
                updateOrderStatus(orderNo, totalPrice, totalGotPrice)
            ]);
            res.status(200).json({ status: true });
        } catch (error) {
            console.log(error);
        }
    }
});

const removeOrderData = async (orderId) => {
    await Order.deleteOne({ orderId: orderId });
}

const reduceStrock = async (newOrder) => {
    try {
        await Promise.all(newOrder.map(orderItem => {
            return Items.findByIdAndUpdate(orderItem.barcode, { $inc: { stock: (- orderItem.amount) } })
        }));
    } catch (error) {
        console.log(error);
    }
}

const updateOrderStatus = async (orderNo, totalPrice, totalGotPrice) => {
    console.log(`${orderNo}  total:${totalPrice}, totalGotPrice:${totalGotPrice}`)
    try {
        let statusData = new Status({
            _id: `${orderNo}`,
            gotPriceTotal: totalGotPrice,
            total: totalPrice,
            profit: (totalPrice - totalGotPrice),
        });
        await statusData.updateOne(statusData);
    } catch (error) {
        console.log(error);
    }
}

const getItem = async (barcode) => {
    try {
        let itemsData = await Items.findOne({ _id: barcode });
        return itemsData;
    } catch (error) {
        console.log(error);
    }
}
router.get('/:orderId', async (req, res) => {
    try {
        let orderId = req.params.orderId;
        let orderData = await Order.find({ orderId: orderId });
        res.status(200).json(orderData);
    } catch (error) {
        res.status(400).json({ status: false, error: error });
    }
});
router.get('/cancle', async (req, res) => {
    try {
        await Order.deleteOne({ _id: req.body.orderId });
        res.status(200).json({ status: true, message: 'Order has been cancled' });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }

});
module.exports = router;