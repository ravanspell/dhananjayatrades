const router = require('express').Router();
let mysqldb = require('../mysqldb');

router.route('/search').get(async (req, res) => {
  try {
    const query = "SELECT name,t,w,r,got_price,barcode FROM Items;"
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

router.post('/save', async (req, res) => {
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
// router.route('/add').post(async (req, res) => {

//   for (const itemd of items) {
//     console.log(itemd._id);
//     let item = new Items(
//       {
//         _id: `${itemd._id}`,
//         name: itemd.name,
//         t: itemd.t,
//         w: itemd.w,
//         r: itemd.r,
//         stock: itemd.stock,
//         company: itemd.company,
//         gotPrice: itemd.gotPrice
//       }
//     )
//     console.log(await item.save(items))
//   }
// });

// router.route('/empty/stockes').get(async (req, res) => {
//   try {
//     let outOfStockItems = await Items.find({ stock: { $lt: 1 } });
//     res.status(200).json(outOfStockItems);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

module.exports = router;