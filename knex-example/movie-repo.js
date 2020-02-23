"use strict";
var promise = require("bluebird");
var db = require("./db");

module.exports = {
    listTags: () => {
        return db.select("id", "name").from("tag").then();
    },

    listRatings: () => {
        return db.select("id", "name").from("rating").then();
    },

    getMovie: (movieId) => {
        return db("movie as m")
                .join("person as p", "p.id", "m.director_id")
                .select("m.*", "p.name")
                .where("m.id", movieId)
                .first()
                .then();
    },

    listTagsFor: (movieId) => {
        return db("tag as t")
                .select("t.id", "t.name")
                .joinRaw("JOIN tag_movie tm ON tm.tag_id=t.id AND tm.movie_id=?", movieId)
                .then();
    },

    listActorsFor: (movieId) => {
        return db("person as p")
                .select("p.id", "p.name")
                .joinRaw("JOIN actor_movie am ON am.person_id=p.id AND am.movie_id=?", movieId)
                .then();
    },

    getForEdit: function(movieId) {
        // return this.getMovie(1);
        var pMovi = this.getMovie(movieId),
            pActors = this.listActorsFor(movieId),
            pTags = this.listTagsFor(movieId);

        return Promise.all([pMovi, pActors, pTags]).then((results) => {
            var m = results[0];
            m.actors = results[1];
            m.tags = results[2];
            return m;
        })
    }
}