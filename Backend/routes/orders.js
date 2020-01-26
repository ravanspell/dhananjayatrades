const router = require('express').Router();
const Order = require('../models/orders.model');
const Items = require('../models/items.model');
const Status = require('../models/status.model');

router.post('/add', async (req, res) => {
    let orderId = 0;
    if (!req.body.hasOwnProperty('orderNo')) {
        while (!Boolean(orderId)) {
            let orderid = Math.floor(Math.random() * 99999);
            let orders = await Order.find({ orderId: orderid });
            if (orders.length < 1) {
                let orderitem = new Order({
                    orderId: orderid
                });
                let orderStatus = await orderitem.save(orderitem)
                console.log(orderStatus);
                orderId = orderStatus.orderId;
                res.status(200).json({ status: true, response: orderStatus.orderId });
            }
        }
    } else {
        const { orderItems, orderNo } = req.body;
        console.log(orderItems);
        let newOrder = Object.keys(orderItems).map(item => {
            return {
                barcode: orderItems[item].id,
                orderId: orderItems[item].orderId,
                itemName: orderItems[item].itemName,
                unitPrice: orderItems[item].unitPrice,
                amount: orderItems[item].amount,
                total: orderItems[item].total
            }
        })
        try {
            await removeOrderData(orderNo);
            await reduceStrock(newOrder);
            await updateOrderStatus(newOrder, orderNo);
            let status = await Order.insertMany(newOrder);
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

const updateOrderStatus = async (order, orderNo) => {
    try {
        let gotPriceTotal = 0;
        let total = 0;
        for (const item of order) {
            let itemData = await getItem(item.barcode);
            gotPriceTotal = gotPriceTotal + itemData.gotPrice;
            total = total + item.total;
        }
        let statusData = new Status({
            _id: `${orderNo}`,
            gotPriceTotal: gotPriceTotal,
            total: total,
            profit: (total - gotPriceTotal),
        });
        await statusData.save(statusData);
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
module.exports = router;