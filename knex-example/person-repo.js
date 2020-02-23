"use strict";
var promise = require("bluebird");
var db = require("./db");

module.exports = {
    listPeople: (searchText) => {
        return db("person").where("name", "like", "%searchText%")
        .select("id", "name")
        .orderBy("name")
        .then();
    }
}