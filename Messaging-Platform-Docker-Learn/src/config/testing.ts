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

    // Messaging DEV:
    // mongodb://dev-messaging-platform:bAhKdsKSbnqKDoa6Kh7vJqsuCNq7ykiM093SGNvWh0nnIgZGV2MV3FAnEw9QZvAErNj
    // mB3bVXJPwkixRzKDplw==@dev-messaging-platform.documents.azure.com:10255/?ssl=true&replicaSet=globaldb
  },
  encryption: {
    key: process.env.ENCRYPT_KEY || 'Pn1sDKBC4UdOfOjG94HaQBCpbOBMVSFS',
    iv: process.env.ENCRYPT_IV || 'U7WnwFpeNTGeiuU4',
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
};
