
exports.up = function(knex) {
  return knex.schema
            .createTable('person', (tbl) => {
                //PK
                tbl.increments('id');
                //fields
                tbl.string('firstname', 30).notNullable().defaultTo('NA');
                tbl.string('lastname', 30).notNullable().defaultTo('NA');
                tbl.string('junk', 60).notNullable().defaultTo('NA');
            })
};

exports.down = function(knex) {
    return knex.schema
                .dropTableIfExits('person');
};
