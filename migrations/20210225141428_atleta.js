exports.up = function(knex) {
    return knex.schema.createTable('atleta', function(table){
        table.increments('id').primary();
        table.integer('pessoa_id').notNullable();
        table.date('data_nascimento').notNullable();
        table.float('altura');
        table.float('peso');

        table.foreign('pessoa_id').references('id').inTable('pessoa');
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('atleta');
  };
  