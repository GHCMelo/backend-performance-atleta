exports.up = function(knex) {
    return knex.schema.createTable('treino', function(table){
        table.increments('id').primary();
        table.date('data').notNullable();
        table.string('semana').notNullable();
        table.integer('tipo_treino_id').notNullable();
        table.integer('periodizacao_id').notNullable();
        table.string('psr');
        table.string('bem_estar');
        table.string('pse_treinador');
        table.string('pse');
        table.string('duracao');
        table.string('training_load');
        table.string('monotonia');
        table.string('strain_dia');
        table.string('cmj');
        table.string('sj');

        table.foreign('tipo_treino_id').references('id').inTable('tipo_treino');
        table.foreign('periodizacao_id').references('id').inTable('periodizacao');
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('treino');
  };
  