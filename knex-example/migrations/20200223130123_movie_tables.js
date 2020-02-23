
exports.up = function(knex) {
    return knex.schema
              .createTable('rating', (tbl) => {
                  //PK
                  tbl.increments().primary();
                  //fields
                  tbl.string('name', 10).notNullable().unique('uq_rating_name').defaultTo('NA');
              })
              .createTable('movie', (tbl) => {
                //PK
                tbl.increments();
                
                //FK
                tbl.integer('rating_id').unsigned().notNullable().index().references('id').inTable('rating');
                tbl.integer('director_id').unsigned().notNullable().references('id').inTable('person')

                // Other Fields
                tbl.string('title', 200).notNullable().defaultTo('');
                tbl.string('overview', 999);
                tbl.integer('releaseyr');
                tbl.integer('score').notNullable().defaultTo(7);
                tbl.integer('runtime').notNullable().defaultTo(90);
                tbl.date('lastplaydt');
            })
            .createTable('tag', (tbl) => {
                //PK
                tbl.increments();
                
                //UQ
                tbl.string('name', 30).notNullable().unique('uq_tag_name');
            })
            //many to many table 
            .createTable('tag_movie', (tbl) => {
                //PK/FK
                tbl.integer('tag_id').unsigned().notNullable().references('id').inTable('tag').onDelete('CASCADE');
                tbl.integer('movie_id').unsigned().notNullable().references('id').inTable('movie').onDelete('CASCADE');

                tbl.primary(['tag_id', 'movie_id']);
            })
            .createTable('actor_movie', (tbl) => {
                //PK/FK
                tbl.integer('person_id').unsigned().notNullable().references('id').inTable('person').onDelete('CASCADE');
                tbl.integer('movie_id').unsigned().notNullable().references('id').inTable('movie').onDelete('CASCADE');

                tbl.primary(['person_id', 'movie_id']);
            })
  };
  
  exports.down = function(knex) {
      return knex.schema
                  .dropTableIfExits('actor_movie')
                  .dropTableIfExits('tag_movie')
                  .dropTableIfExits('tag')
                  .dropTableIfExits('movie')
                  .dropTableIfExits('rating')
  };
