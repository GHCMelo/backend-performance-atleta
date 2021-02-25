exports.up = function(knex) {
    return knex.schema.createTable('atleta_has_treino', function(table){
        table.increments('id').primary();
        table.integer('atleta_id').notNullable();
        table.integer('treino_id').notNullable();

        table.foreign('atleta_id').references('id').inTable('atleta');
        table.foreign('treino_id').references('id').inTable('treino');
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('atleta_has_treino');
  };
