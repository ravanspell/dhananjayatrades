const router = require('express').Router();
let mysqldb = require('../mysqldb');
const auth = require('../middleware/auth');
/**
 * Return this all catagories
 */
router.get('/all', auth, async (req, res) => {
    try {
        const query = `SELECT  * FROM catagory;`
        const result = await mysqldb.query(query);
        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message)
    }
});

module.exports = router;