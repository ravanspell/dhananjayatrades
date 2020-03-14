const router = require('express').Router();
let Items = require('../models/items.model');
const items = require("./itemss.json");
let mysqldb = require('../mysqldb');

router.route('/').get((req, res) => {
  Items.find()
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ status: false, error: error }));
});

router.route('/test').get((req, res) => {
  res.status(200).json({ status: false, message: "it's working" });
});

router.route('/search').get(async (req, res) => {
  try {
    const query = "SELECT name,t,w,r,got_price,barcode FROM items;"
    let items = await mysqldb.query(query); //await Items.find({}, { name: 1, t: 1, r: 1, w: 1, gotPrice: 1 });
    //console.log(items);
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

router.route('/add').post(async (req, res) => {

  for (const itemd of items) {
    console.log(itemd._id);
    let item = new Items(
      {
        _id: `${itemd._id}`,
        name: itemd.name,
        t: itemd.t,
        w: itemd.w,
        r: itemd.r,
        stock: itemd.stock,
        company: itemd.company,
        gotPrice: itemd.gotPrice
      }
    )
    console.log(await item.save(items))
  }
});

router.route('/empty/stockes').get(async (req, res) => {
  try {
    let outOfStockItems = await Items.find({ stock: { $lt: 1 } });
    res.status(200).json(outOfStockItems);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;