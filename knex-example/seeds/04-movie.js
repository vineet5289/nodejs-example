exports.seed = (knex, Promise) => {
  var tblString = 'movie';
  var rows = [
    {rating_id: 1, director_id: 1, title: 'the rock', releaseyr: 2004, score: 4, runtime: 10, lastplaydt: '2005-01-01'},
  ]
  return knex(tblString)
        .del()
        .then(() => {
          return knex.insert(rows).into(tblString);
        });
}