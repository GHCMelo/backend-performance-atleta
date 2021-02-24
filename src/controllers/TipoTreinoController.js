const connection = require('../database/connection');

module.exports = {
    async index(req, res){
        const tipos_treino = await connection('tipo_treino');

        res.status(200).send(tipos_treino)
    }
}