//========================v2=============
"use strict";
var db = require("./db");
var mRepo = require("./movie-repo");
var pRepo = require("./person-repo");

//perform search on person
//list ratings
// list tag

//add movie
var movie = {
    id: 0,
    rating_id: 4,
    director_id: 1,
    actors: [2],
    tag: [1, 2],
    title: "test movie raw",
    releaseyr: 2003,
    score: 5,
    runtime: 1,
    lastplaydt: "2015-10-23",
    overview: "adding this via code"
};

mRepo.getForEdit(1).then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
.finally (() => {
    db.destroy();
});
//========================v1=============
// var cfg = require("./knex-cfg").mysql;
// var treeize = require("treeize");
// var promise = require("bluebird");

// var pAuthorRows = knex("authors").where("id", 1).debug(false).then();
// var pBookRows = knex("books").where("author_id", 1).debug(false).then();

// promise.all([pAuthorRows, pBookRows]).then((results) => {
//     var autor = results[0][0];
//     autor.book = results[1];
//     console.log(autor);
// }).finally(() => {
//     knex.destroy();
// });

// var query = knex("books")
//                 .join("authors", "authors.id", "=", "books.author_id")
//                 .select
//                 (
//                     "authors.id", "authors.name", 
//                     "books.title as book:title", "books.id as book:id"
//                 )
//                 .where("authors.id", 1)
//                 .debug(false)
//                 .then((rows) => {
//                     var tree = new treeize();
//                     tree.grow(rows);
//                     var authors = tree.getData();
//                     console.log(rows);
//                     //console.log(authors[1]);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 })
//                 .finally(() => {
//                     knex.destroy();
//                     console.log("i am done");
//                 });





// knex.select('id', 'name').from('authors').then((rows) => {
//     console.log("row return", rows);
// }).catch(err => {
//     console.log("inside error", err);
// }).finally(() => {
//     knex.destroy();
//     console.log("i am done");
// });

// knex.select(knex.raw("count(*) as authorCount")).from('authors').then((rows) => {
//     console.log("row return", rows);
// }).catch(err => {
//     console.log("inside error", err);
// }).finally(() => {
//     knex.destroy();
//     console.log("i am done");
// });


// knex.raw("select * from books where author_id=?", [1]).then((rows) => {
//     console.log("row return", rows);
// }).catch(err => {
//     console.log("inside error", err);
// }).finally(() => {
//     knex.destroy();
//     console.log("i am done");
// });

