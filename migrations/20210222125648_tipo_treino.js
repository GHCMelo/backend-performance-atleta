exports.up = function(knex) {
    return knex.schema.createTable('tipo_treino', function(table){
        table.increments('id').primary();
        table.string('tipo_treino').notNullable();
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('tipo_treino');
  };
  