const router = require('express').Router();
let mysqldb = require('../mysqldb');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const constants = require("../constants.js");

router.route('/search').get(auth, async (req, res) => {
    try {
        console.log(req.user);
        const query = `SELECT id, name, price, stock, cost
                       FROM items;`;
        let items = await mysqldb.query(query);
        let newItems = items.map(searchItem => {
            return {
                id: searchItem.id,
                value: searchItem.name,
                cost: searchItem.cost,
                price: searchItem.price,
                stock: searchItem.stock,
            }
        })
        res.status(200).json(newItems);
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});
//save stock
router.post('/save', [auth, roles([constants.SUPER_ADMIN, constants.ADMIN])], async (req, res) => {
    try {
        const { itemName, amount, catagory, cost, price } = req.body;
	
        const itemSaveQuery = `INSERT INTO items (category, name, price, cost, stock )
                               VALUES ( ${catagory}, "${itemName}", ${price}, ${cost}, ${amount})`;

        await mysqldb.query(itemSaveQuery);
        return res.status(201).json({ status: true, message: "Item has been saved" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});
//get all stock data 
router.route('/all/:page/:limit').get(auth, async (req, res) => {
    const { page, limit } = req.params;
    const offset = (page - 1) * limit;
    //! should change table name after development
    const stockQuery = `SELECT *
                        FROM items
                        ORDER BY id ASC LIMIT ${limit}
                        OFFSET ${offset}`;
    const dataCountQuery = `SELECT COUNT(*) AS count
                            FROM items`;

    const [pageItems, allCount] = await Promise.all([
        mysqldb.query(stockQuery),
        mysqldb.query(dataCountQuery),
    ])
    return res.status(201).json({ status: true, data: pageItems, count: allCount[0].count });
});

//search stock data 
router.route('/search/all/:tearm').get(auth, async (req, res) => {
    const { tearm } = req.params;
    const stockSearchQuery = `SELECT *
                              FROM items
                              WHERE id LIKE "%${tearm}%"
                                 OR name LIKE "%${tearm}%"
                                 OR cost LIKE "%${tearm}%"
                                 OR price LIKE "%${tearm}%"
                                 OR stock LIKE "%${tearm}%"
                              ORDER BY id ASC `;
    const result = await mysqldb.query(stockSearchQuery);
    return res.status(201).json({ status: true, data: result, count: result.length });
});

router.route('/delete').delete([auth, roles([constants.SUPER_ADMIN, constants.ADMIN])], async (req, res) => {
    //! should change table name after development
    try {
        const { item_id } = req.body;
        const stockRemoveQuery = `DELETE
                                  FROM items
                                  WHERE id = ${item_id}`;
        console.log("stockRemoveQuery", stockRemoveQuery);
        const status = await mysqldb.query(stockRemoveQuery);
        return res.status(201).json({ status: true, message: 'Item has been deleted' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error });
    }
});

//Edit stock item
router.route('/update').put([auth, roles([constants.SUPER_ADMIN, constants.ADMIN])], async (req, res) => {
    //! should change table name after development
    try {
        const { item_data } = req.body;
        const editStockItemQuery = `UPDATE items
                                    SET name='${item_data.name}',
                                        price=${item_data.price},
                                        cost=${item_data.cost},
                                        stock=${item_data.stock}
                                    WHERE id = ${item_data.id}`;
        const status = await mysqldb.query(editStockItemQuery);
        return res.status(201).json({ status: true, message: 'Item has been updated' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error });
    }
});
// router.route('/empty/stockes').get(async (req, res) => {
//   try {
//     let outOfStockItems = await Items.find({ stock: { $lt: 1 } });
//     res.status(200).json(outOfStockItems);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

module.exports = router;