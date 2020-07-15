const router = require('express').Router();
const mysqldb = require('../mysqldb');
const auth = require('../middleware/auth');
/**
 * Add new order or finish and intiate new order 
 */
router.post('/add', auth, async (req, res) => {

    const orders = req.body;
    for (let date in orders) {
        console.log("save data of", date);
        console.log(orders[date].length, "orders");
        for (let order of orders[date]) {
            const { orderItems, orderNo, totalPrice, totalGotPrice, date } = order;
            console.log(orderNo);
            console.log(JSON.stringify(orderItems));
            console.log('<-------------------------------->');
            try {
                const orderStatusUpdateQuery = `INSERT INTO status (order_id,date,got_price_total,total,profit) 
                                                VALUES ("${orderNo}","${date}",${totalGotPrice},${totalPrice},${totalPrice - totalGotPrice})`;

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
                await mysqldb.query(orderStatusUpdateQuery); //udate order satus with total order profit and total got price
                await Promise.all([
                    mysqldb.query(insertNewOrderItemsQuery, insertAllNewOrderItemsQuery),
                    reduceStrock(orderItems),
                ]);
            } catch (error) {
                console.log(error);
            }
        }
    }
    return res.status(200).json({ status: true });
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

// router.get('/:orderId', async (req, res) => {
//     try {
//         let orderId = req.params.orderId;
//         let orderData = await Order.find({ orderId: orderId });
//         res.status(200).json(orderData);
//     } catch (error) {
//         res.status(400).json({ status: false, error: error });
//     }
// });
// router.get('/cancle', async (req, res) => {
//     try {
//         await Order.deleteOne({ _id: req.body.orderId });
//         res.status(200).json({ status: true, message: 'Order has been cancled' });
//     } catch (error) {
//         res.status(400).json({ status: false, error: error.message });
//     }

// });
module.exports = router;