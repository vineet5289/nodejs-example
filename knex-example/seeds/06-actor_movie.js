exports.seed = (knex, Promise) => {
  var tblString = 'actor_movie';
  var rows = [
    {movie_id: 1, person_id: 1}
  ]
  return knex(tblString)
        .del()
        .then(() => {
          return knex.insert(rows).into(tblString);
        });
}
