exports.up = function(knex) {
    return knex.schema.createTable('pessoa_has_treino', function(table){
        table.increments('id').primary();
        table.integer('pessoa_id').notNullable();
        table.integer('treino_id').notNullable();

        table.foreign('pessoa_id').references('id').inTable('pessoa');
        table.foreign('treino_id').references('id').inTable('treino');
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('pessoa_has_treino');
  };
  