
exports.up = function(knex) {
  return knex.schema.createTable('tipo_pessoa', function(table){
      table.increments('id').primary();
      table.string('tipo_pessoa').notNullable();
  })
};

exports.down = function(knex) {
    knex.schema.dropTable('tipo_pessoa');
};
