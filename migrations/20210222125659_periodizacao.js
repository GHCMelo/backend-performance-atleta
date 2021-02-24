exports.up = function(knex) {
    return knex.schema.createTable('periodizacao', function(table){
        table.increments('id').primary();
        table.string('periodizacao').notNullable();
    })
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('periodizacao');
  };
  