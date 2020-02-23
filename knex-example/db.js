"use strict";

var cfg = require("./knexfile");
var knex = require("knex")(cfg.development);

module.exports = knex;