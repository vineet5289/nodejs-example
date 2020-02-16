module.exports = {
  // enabled logging for development
  logging: true,
  seed: true,
  db: {
    url:
      process.env.MONGODB_URL ||
      'mongodb://dev-messaging-platform:y7PKCmot7TYcJQr7xPcdNLGjzkbv5QmBuHpWLG2oI8HGvw4T0ikC9Lti1Uk0HXLCZW7uOcxTR8u3iyKgA304Dg==@dev-messaging-platform.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',

    // mongo atlas connnection string
    // 'mongodb+srv://messaging_platform:xalBics9e6Gu10zc@messagingplatform-djkww.mongodb.net/
    // messaging_platform?retryWrites=true&w=majority'
  },
  encryption: {
    key: process.env.ENCRYPT_KEY || 'a2PpMQrw3TKkcyNPFNiXqNKKK1SMvPfd',
    iv: process.env.ENCRYPT_IV || 'rbVUFHSEspI89Qv2',
  },
  redis: {
    host:
      process.env.MESSAGING_REDIS_HOST ||
      'connect-dev-rcache.redis.cache.windows.net',
    port: process.env.MESSAGING_REDIS_PORT || 6379,
    key:
      process.env.MESSAGING_REDIS_KEY ||
      '+T3+7OIFLe1dDqkSJbmvtM7P6mQKyTsW1Exsn8qH3I4=',
  },
  elasticsearch: {
    host:
      process.env.ELASTICSEARCH_HOST ||
      'http://elastic:connectadmin@123@52.236.175.207:9200/',
    username: process.env.USER_NAME || 'elastic',
    password: process.env.PASSWORD || 'connectadmin@123',
  },
  messageSearchIndex: {
    indexNamePrefix: 'chat-message',
    indexTemplateName: 'chat-message-template',
  },
};
