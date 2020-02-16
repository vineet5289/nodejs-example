const express = require('express');
import router from './api/v1/v1';

const app = express();

app.use('/api/v1/', router);

module.exports = app;
