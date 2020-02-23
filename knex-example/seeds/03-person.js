exports.seed = (knex, Promise) => {
  var tblString = 'person';
  var rows = [
    {name: 'vineet Singh', firstname: 'vineet', lastname: 'singh'},
    {name: 'sumit kumar', firstname: 'sumit', lastname: 'kumar'},
  ]
  return knex(tblString)
        .del()
        .then(() => {
          return knex.insert(rows).into(tblString);
        });
}