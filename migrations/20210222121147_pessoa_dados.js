
exports.up = function(knex) {
    return knex.schema.createTable('pessoa', function(table){
        table.increments('id').primary();
        table.string('nome_completo').notNullable();
        table.string('email').notNullable();
        table.string('senha').notNullable();
        table.date('criado_em').notNullable();
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('pessoa');
  };
  