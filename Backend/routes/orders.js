const router = require('express').Router();
const Order = require('../models/orders.model');
const Items = require('../models/items.model');
const Status = require('../models/status.model');
let mysqldb = require('../mysqldb');

router.post('/add', async (req, res) => {
    if (!req.body.hasOwnProperty('orderNo')) {
        const newOrderId = await createNewOrderId();
        res.status(200).json({ status: true, response: newOrderId });
    } else {
        const { orderItems, orderNo, totalPrice, totalGotPrice } = req.body;
        try {

            const orderStatusUpdateQuery = `UPDATE status 
                                            SET ORDER_ID = "${orderNo}",
                                                got_price_total= ${totalGotPrice},
                                                total= ${totalPrice},
                                                profit=${totalPrice - totalGotPrice} 
                                            WHERE order_id="${orderNo}"`;

            let insertNewOrderItemsQuery = `INSERT INTO sale (barcode, order_id, order_name, unit_price, qty, total) 
                                            VALUES ?`;
            const insertAllNewOrderItemsQuery = orderItems.map(item => {
                return [
                    item.barcode,
                    `${orderNo}`,
                    `${item.itemName}`,
                    item.unitPrice,
                    item.amount,
                    item.total
                ]
            });
            const [nextOrderId] = await Promise.all([
                createNewOrderId(),
                mysqldb.query(insertNewOrderItemsQuery, insertAllNewOrderItemsQuery),
                mysqldb.query(orderStatusUpdateQuery), //udate order satus with total order profit and total got price
                reduceStrock(orderItems),
            ]);
            res.status(200).json({ status: true, response: nextOrderId });
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
            let updateAmountQuery = `UPDATE items SET stock = stock - ${orderItem.amount} WHERE barcode ='${orderItem.barcode}'`;
            return mysqldb.query(updateAmountQuery);
        }));
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
const date = () => {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    return `${year}-${month}-${day}`;
}
const createNewOrderId = async () => {
    let orderId = 0;
    while (!Boolean(orderId)) {
        let orderid = Math.floor(Math.random() * 99999);
        // let orders = await Status.find({ _id: orderid });
        let query = `SELECT * FROM Sale WHERE order_id ="${orderid}"`;
        let orders = await mysqldb.query(query);
        if (orders.length < 1) {
            const statusTableQuery = `INSERT INTO status (order_id, date,got_price_total,total,profit) 
                                      VALUES ("${orderid}",${date()},0,0,0)`;
            let orderStatus = await mysqldb.query(statusTableQuery);
            console.log(orderStatus);
            orderId = orderid
            return orderId
        }
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