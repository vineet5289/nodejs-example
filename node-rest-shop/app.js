const express = require('express');

const app = express();

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;
