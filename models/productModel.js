const mysqlConnection = require('../config/mysqlConnection');

const addProduct = (name, description, price, callback) => {
    const sql = 'INSERT INTO product (ProductName, Description, Price) VALUES (?, ?, ?)';
    const values = [name, description, price];

    mysqlConnection.query(sql, values, (err, result) => {
        if (err) return callback(err);

        console.log('Product saved to MySQL');
        return callback(null, result);
    });
};



const getProducts = (searchTerm, callback) => {
    let sql = 'SELECT p.*, pc.* FROM Product p JOIN ProductCategory pc '+
    'ON p.CategoryID = pc.CategoryID';
    const values = [];

    if (searchTerm) {
        sql += ' WHERE ProductName LIKE ?';
        values.push(`%${searchTerm}%`);
    }

    mysqlConnection.query(sql, values, (err, results) => {
        if (err) {
            console.error(err);
            return callback(err, null);
        }

        const products = results;
        callback(null, products);
    });
};

const getProductCategories = (callback) => {
    const sql = 'SELECT DISTINCT CategoryID, CategoryName FROM productcategory';

    mysqlConnection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return callback(err, null);
        }

        const categories = results.map(result => ({ id: result.CategoryID, name: result.CategoryName }));
        callback(null, categories);
    });
};

module.exports = { getProductCategories, addProduct, getProducts};
