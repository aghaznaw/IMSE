const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const productController = require('./controllers/productController');
require('dotenv').config();
const app = express();
const port = 3000;

// MySQL Connection
const mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

mysqlConnection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    // Fetch product CategoryID and CategoryName from the database
    const sql = 'SELECT DISTINCT CategoryID, CategoryName FROM productcategory';

    mysqlConnection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        // Assuming the table has columns CategoryID and CategoryName
        const categories = results.map(result => ({ id: result.CategoryID, name: result.CategoryName }));

        // Render the form with dynamic product categories
        res.render('addProduct', { categories });
    });
});

//routes
app.get('/', productController.showAddProductForm);
app.get('/products', productController.showProductList);
app.post('/addProduct', productController.addProduct);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
