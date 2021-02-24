const connection = require('../database/connection');

module.exports = {
    async index(req, res){
        const periodizacao = await connection('periodizacao');

        res.status(200).send(periodizacao)
    }
}