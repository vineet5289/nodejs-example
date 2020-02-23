
exports.up = function(knex) {
    return knex
            .schema
            .hasTable('person')
            .then((exits) => {
                if(exits) {
                    return knex.schema.table('person', (tbl) => {
                                tbl.renameColumn('junk', 'name');
                            })
                }
            })
};

exports.down = function(knex) {
    return knex
    .schema
    .hasTable('person')
    .then((exits) => {
        if(exits) {
            return knex.schema.table('person', (tbl) => {
                        tbl.renameColumn('name', 'junk');
                    })
        }
    })
};
