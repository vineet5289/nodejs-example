
exports.seed = (knex, Promise) => {
  var tblString = 'tag_movie';
  var rows = [
    {movie_id: 1, tag_id: 1},
  ]
  return knex(tblString)
        .del()
        .then(() => {
          return knex.insert(rows).into(tblString);
        });
}
