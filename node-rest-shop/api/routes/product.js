const express = require('express');

const routes = express.Router();

routes.get('/', (request, response, next) => {
    response.status(200).json({
        message: 'handling get request of product'
    });
});

routes.post('/', (request, response, next) => {
    response.status(201).json({
        message: 'handling post request of product'
    });
});

routes.get('/:productId', (request, response, next) => {
    const productId = request.params.productId
    console.log(`received product id {productId}`);
    response.status(200).json({
        message: 'handling get request of product'
    });
});

routes.patch('/:productId', (request, response, next) => {
    const productId = request.params.productId
    console.log(`received product id {productId}`);
    response.status(200).json({
        message: 'product updated'
    });
});

routes.delete('/:productId', (request, response, next) => {
    const productId = request.params.productId
    console.log(`received product id {productId}`);
    response.status(200).json({
        message: 'product deleted'
    });
});

module.exports = routes;