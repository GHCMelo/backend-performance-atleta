
exports.up = function(knex) {
    return knex.schema.createTable('pessoa', function(table){
        table.increments('id').primary();
        table.integer('tipo_pessoa_id').notNullable();
        table.string('nome_completo').notNullable();
        table.string('email').notNullable();
        table.string('senha').notNullable();

        table.foreign('tipo_pessoa_id').references('id').inTable('tipo_pessoa')
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('pessoa');
  };
  