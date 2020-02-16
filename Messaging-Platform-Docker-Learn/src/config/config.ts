let _ = require('lodash');

let config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT || 5200,
  env: '',
};

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.dev;
}
config.env = process.env.NODE_ENV;

let envConfig;
// require could error out if
// the file don't exist so lets try this statement
// and fallback to an empty object if it does error out
try {
  envConfig = require('./' + config.env);
  // just making sure the require actually
  // got something back :)
  envConfig = envConfig || {};
} catch (e) {
  envConfig = {};
}

// merge the two config files together
// the envConfig file will overwrite properties
// on the config object
module.exports = _.merge(config, envConfig);
