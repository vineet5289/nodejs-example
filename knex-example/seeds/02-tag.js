exports.seed = (knex, Promise) => {
  var tblString = 'tag';
  var rows = [
    {name: '3D'},
    {name: 'Action'},
    {name: 'Animation'},
    {name: 'Comedy'},
  ]
  return knex(tblString)
        .del()
        .then(() => {
          return knex.insert(rows).into(tblString);
        });
}