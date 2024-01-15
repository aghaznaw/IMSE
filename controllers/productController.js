const productModel = require('../models/productModel');

exports.addProduct = (req, res) => {
    const { name, description, price } = req.body;

    // Save to MySQL using the model
    productModel.addProduct(name, description, price, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        console.log('Product saved to MySQL');
        res.render('success');
    });
};


exports.showProductList = (req, res) => {
    const searchTerm = req.query.search;

    productModel.getProductCategories((err, categories) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        productModel.getProducts(searchTerm, (err, products) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            res.render('productList', { categories, products, searchTerm });
        });
    });
};


exports.showAddProductForm = (req, res) => {
    productModel.getProductCategories((err, categories) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        res.render('addProduct', { categories });
    });
};
