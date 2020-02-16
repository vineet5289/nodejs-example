const http = require('http');
const config = require('./config/config');
const chatServer = require('./socket/chatServer');
const app = require('./app');

import Mongo from './db/mongodb';
import Redis from './db/redis';
import IO from './socket/io';
import ElasticSearchIndexTemplateUtil from './util/elasticsearch/elasticSearchIndexTemplate.util';
import logger from './util/logger.util';

const server = http.createServer(app, (request: any, response: any) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello World\n');
});

// Initialize socket io to listen for new connections
IO.initialize(server);
chatServer.configureSocket();

// Instantiate redis client
Redis.getInstance();

ElasticSearchIndexTemplateUtil.createChatMessageTemplate();

// Start server when the mongo connection is made.
Mongo.getInstance(() =>
  server.listen(config.port, () =>
    logger.info(`Server started on port ${config.port}`)
  )
);
