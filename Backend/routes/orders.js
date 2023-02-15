const router = require('express').Router();
const mysqldb = require('../mysqldb');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const constants = require("../constants.js")
/**
 * Add new order or finish and intiate new order
 */
router.post('/add', auth, async (req, res) => {
    const orders = req.body;

    for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
        const order = orders[orderIndex];
        const { orderItems, orderNo, totalPrice, totalGotPrice, date, customer } = order;
        console.log(orderNo);
        console.log(JSON.stringify(orderItems));
        console.log('<-------------------------------->');
        try {
            const orderStatusUpdateQuery = `INSERT INTO status (order_id, customer_id, date, got_price_total, total, profit)
                                            VALUES ("${orderNo}", "${customer}", "${date}", ${totalGotPrice},
                                                    ${totalPrice}, ${totalPrice - totalGotPrice})`;

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
            await mysqldb.query(orderStatusUpdateQuery); //update order status with total order profit and total got price
            await Promise.all([
                mysqldb.query(insertNewOrderItemsQuery, insertAllNewOrderItemsQuery),
                reduceStrock(orderItems),
            ]);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false });
        }
    }
    // }
    return res.status(200).json({ status: true });
});

const removeOrderData = async (orderId) => {
    await Order.deleteOne({ orderId: orderId });
}

const reduceStrock = async (newOrder) => {
    try {
        await Promise.all(newOrder.map(orderItem => {
            let updateAmountQuery = `UPDATE items
                                     SET stock = stock - ${orderItem.amount}
                                     WHERE barcode = '${orderItem.barcode}'`;
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

//get all stock data 
router.route('/hostory/:page/:limit').get([auth, roles([constants.SUPER_ADMIN])], async (req, res) => {
    const { page, limit } = req.params;
    const offset = (page - 1) * limit;
    //! should change table name after development
    const stockQuery = `SELECT *
                        FROM status
                        LEFT JOIN customers
                        ON status.customer_id = customers.id
                        ORDER BY date DESC LIMIT ${limit}
                        OFFSET ${offset}`;
    const dataCountQuery = `SELECT COUNT(*) AS count
                            FROM status`;

    const [pageItems, allCount] = await Promise.all([
        mysqldb.query(stockQuery),
        mysqldb.query(dataCountQuery),
    ])
    return res.status(201).json({ status: true, data: pageItems, count: allCount[0].count });
});

//search order data
router.route('/kitchen').get(auth, async (req, res) => {
    const orderQuery = `SELECT orders FROM kitchen WHERE id= 1`;
    const [response] = await mysqldb.query(orderQuery);
    return res.status(200).json({ success: true, data: response });
});

router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderQuery = `SELECT *
                            FROM sale
                                INNER JOIN status
                                ON sale.order_id = status.order_id
                            WHERE sale.order_id = "${orderId}"`;

        const orderData = await mysqldb.query(orderQuery);
        return res.status(201).json({ status: true, data: orderData });
    } catch (error) {
        return res.status(400).json({ status: false, error: error });
    }
});
//search order data
router.route('/search/all/:tearm').get(auth, async (req, res) => {
    const { tearm } = req.params;
    const stockSearchQuery = `SELECT *
                              FROM status
                              WHERE order_id LIKE "%${tearm}%"
                                 OR date LIKE "%${tearm}%"
                              ORDER BY date ASC `;
    const result = await mysqldb.query(stockSearchQuery);
    return res.status(201).json({ status: true, data: result, count: result.length });
});


//send order data to kitchen
router.route('/pin').post(auth, async (req, res) => {
    const orders = req.body;
    const orderData = orders.filter(order => order.orderItems.length > 0).reverse()

    const orderQuery = `SELECT orders FROM kitchen WHERE id= 1`;
    const response = await mysqldb.query(orderQuery);
    if (response.length > 0) {
        let updateQuery = `UPDATE kitchen
        SET orders = '${JSON.stringify(orderData).replace(/\s+/g, '')}'
        WHERE id = 1`;
        await mysqldb.query(updateQuery);
    } else {
        const insertQuery = `INSERT INTO kitchen (orders )
                                VALUES ('${JSON.stringify(orderData).replace(/\s+/g, '')}')`;
        await mysqldb.query(insertQuery);
    }
    // global.io.emit("broadcast", orders.filter(order => order.orderItems.length > 0).reverse());
    return res.status(201).json({ success: true });
});

module.exports = router;