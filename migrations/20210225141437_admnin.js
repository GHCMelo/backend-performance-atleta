exports.up = function(knex) {
    return knex.schema.createTable('admin', function(table){
        table.increments('id').primary();
        table.integer('pessoa_id').notNullable();

        table.foreign('pessoa_id').references('id').inTable('pessoa');
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('admin');
  };
  