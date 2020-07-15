const router = require('express').Router();
let mysqldb = require('../mysqldb');
const auth = require('../middleware/auth');
//!auth
router.route('/search').get(async (req, res) => {
  try {
    console.log(req.user);
    const query = `SELECT name,t,w,r,got_price,barcode FROM items;`;
    let items = await mysqldb.query(query);
    let newItems = items.map(searchItem => {
      return {
        id: searchItem.barcode,
        value: searchItem.name,
        tPrice: searchItem.t,
        wPrice: searchItem.w,
        rPrice: searchItem.r,
        gotPrice: searchItem.got_price
      }
    })
    res.status(200).json(newItems);
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});
//save stock
router.post('/save', auth, async (req, res) => {
  try {
    const { barcode, itemName, amount, tonPrice, wholePrice, retailPrice, company, gotPrice } = req.body;
    const query = `SELECT barcode FROM items WHERE barcode =${barcode}`;
    const item = await mysqldb.query(query);
    if (item.length > 0) {
      return res.status(400).json({ status: false, message: "Barcode alredy in use" });
    }
    const itemSaveQuery = `INSERT INTO items (barcode,name,stock,t,w,r,company,got_price) 
                           VALUES(${barcode},"${itemName}",${amount},${tonPrice},${wholePrice},${retailPrice},"${company}",${gotPrice})`;
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
  const stockQuery = `SELECT * FROM items ORDER BY barcode ASC LIMIT ${limit} OFFSET ${offset}`;
  const dataCountQuery = `SELECT COUNT(*) AS count FROM items`;

  const [pageItems, allCount] = await Promise.all([
    mysqldb.query(stockQuery),
    mysqldb.query(dataCountQuery),
  ])
  return res.status(201).json({ status: true, data: pageItems, count: allCount[0].count });
});


router.route('/delete', auth).delete(async (req, res) => {
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
router.route('/update').put(auth, async (req, res) => {
  //! should change table name after development
  try {
    const { barcode, item_data } = req.body;

    const editStockItemQuery = `UPDATE items SET name='${item_data.itemName}', 
                                              got_price=${item_data.gotPrice}, 
                                              t=${item_data.tonPrice}, 
                                              w=${item_data.wholePrice}, 
                                              r=${item_data.retailPrice}, 
                                              stock=${item_data.amount}, 
                                              company='${item_data.company}' 
                              WHERE barcode =${barcode}`;
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