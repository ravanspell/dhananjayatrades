const router = require('express').Router();
let mysqldb = require('../mysqldb');
const auth = require('../middleware/auth');

router.route('/').get(auth, async (req, res) => {
  try {
    const query = `SELECT * FROM customers;`;
    let items = await mysqldb.query(query);
    let data = items.map(searchItem => {
      return {
        id: searchItem.id,
        name: searchItem.name,
        contactNo: searchItem.contact_no,
        address: searchItem.address,
        shopName: searchItem.shop_name,
      }
    })
    res.status(200).json({ status: true, data, });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});
//save stock
router.post('/', auth, async (req, res) => {
  try {
    const { name, contactNo, address, shopName } = req.body;
    
    const query = `INSERT INTO customers (name,address,contact_no,shop_name) 
                           VALUES("${name}","${address}","${contactNo}","${shopName}")`;
    const response = await mysqldb.query(query);
    const data = {
        id: response?.insertId,
        ...req.body,
    }
    return res.status(201).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});
//get all stock data 
router.route('/all/:page/:limit').get(auth, async (req, res) => {
  const { page, limit } = req.params;
  const offset = (page - 1) * limit;
  //! should change table name after development
  const stockQuery = `SELECT * FROM items ORDER BY barcode ASC LIMIT ${limit} OFFSET ${offset}`;
  const dataCountQuery = `SELECT COUNT(*) AS count FROM items`;

  const [pageItems, allCount] = await Promise.all([
    mysqldb.query(stockQuery),
    mysqldb.query(dataCountQuery),
  ])
  return res.status(201).json({ status: true, data: pageItems, count: allCount[0].count });
});

//search stock data 
// router.route('/search/all/:tearm').get(auth, async (req, res) => {
//   const { tearm } = req.params;
//   const stockSearchQuery = `SELECT * FROM items 
//                             WHERE barcode LIKE "%${tearm}%" 
//                             OR name LIKE "%${tearm}%"
//                             OR t LIKE "%${tearm}%" 
//                             OR w LIKE "%${tearm}%" 
//                             OR r LIKE "%${tearm}%" 
//                             OR got_price LIKE "%${tearm}%"
//                             OR company LIKE "%${tearm}%"
//                             OR stock LIKE "%${tearm}%" 
//                             ORDER BY barcode ASC `;
//   const result = await mysqldb.query(stockSearchQuery);
//   return res.status(201).json({ status: true, data: result, count: result.length });
// });

router.route('/', auth).delete(async (req, res) => {
  //! should change table name after development
  try {
    const { item_id } = req.body;
    const stockRemoveQuery = `DELETE  FROM items WHERE barcode =${item_id}`;
    const status = await mysqldb.query(stockRemoveQuery);
    return res.status(201).json({ status: true, message: 'Item has been deleted' });
  } catch (error) {
    return res.status(400).json({ status: false, message: error });
  }
});

//Edit stock item
router.route('/').put(auth, async (req, res) => {
  //! should change table name after development
  try {
    const { item_data } = req.body;

    const editStockItemQuery = `UPDATE items SET name='${item_data.name}', 
                                              got_price=${item_data.got_price}, 
                                              t=${item_data.t}, 
                                              w=${item_data.w}, 
                                              r=${item_data.r}, 
                                              stock=${item_data.stock}, 
                                              company='${item_data.company}' 
                              WHERE barcode =${item_data.barcode}`;
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