const express = require('express');

const routes = express.Router();

routes.get('/', (request, response, next) => {
    response.status(200).json({
        message: "order fetched"
    });
});

routes.post('/', (request, response, next) => {
    response.status(201).json({
        message: "order created"
    });
});

routes.get('/:orderId', (request, response, next) => {
    const orderId = request.params.orderId;
    console.log(`received orderId : {orderId}`)
    response.status(200).json({
        message: "order fetched",
        id: orderId
    });
});

module.exports = routes;