

class MysqlDb {

    /**
     * 
     * @param {string} query mysql database query
     */
    static query(query, records = null) {
        return new Promise((resolve, reject) => {
            db.query(query, [records], (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    }


}

module.exports = MysqlDb;