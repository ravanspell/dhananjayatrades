const router = require('express').Router();
let mysqldb = require('../mysqldb');
const auth = require('../middleware/auth');
/**
 * Return this month and last month profit data
 */
router.get('/profit', auth, async (req, res) => {
    let thisMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let lastMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const query = `SELECT  date,SUM(profit) AS profit 
                    FROM status 
                    WHERE date >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH,'%y-%m-01') 
                    GROUP BY date`;
    const da = await mysqldb.query(query);
    const currantDate = new Date();
    for (let dateData of da) {
        const resultDate = new Date(dateData.date);
        if ((resultDate.getMonth() + 1) === (currantDate.getMonth() + 1)) {
            thisMonth[resultDate.getDate() - 1] = dateData.profit;
        } else {
            lastMonth[resultDate.getDate() - 1] = dateData.profit;
        }
    }
    res.status(200).json({ status: true, response: { thisMonth, lastMonth } });
});

module.exports = router;