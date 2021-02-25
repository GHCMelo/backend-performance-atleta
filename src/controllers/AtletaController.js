const connection = require('../database/connection');

module.exports = {
    async index(req, res) {
        const atletas = await connection('atleta')
        .select('atleta.id', 'atleta.peso', 'atleta.altura', 'atleta.data_nascimento', 'pessoa.nome_completo', 'pessoa.email')
        .join('pessoa', 'pessoa.id', '=', 'atleta.pessoa_id');

        res.status(200).send(atletas)
    },

    async getById(req, res) {

        const { id } = req.params

        const atletas = await connection('atleta')
        .select('atleta.id', 'atleta.peso', 'atleta.altura', 'atleta.data_nascimento', 'pessoa.nome_completo', 'pessoa.email')
        .join('pessoa', 'pessoa.id', '=', 'atleta.pessoa_id')
        .where('atleta.id', id);

        res.status(200).send(atletas)
    },

    async create(req, res) {
        const { pessoa_id, data_nascimento, altura, peso  } = req.body;

        const existsWithPessoaId = await connection('atleta')
        .where('pessoa_id', pessoa_id)

        if(existsWithPessoaId.length > 0){
            res.status(401).send({
                msg: "Já existe um atleta cadastrado para este usuário",
                error: true
            })
        }

        await connection('atleta').insert({
            pessoa_id,
            data_nascimento,
            altura,
            peso
        })

        res.status(201).send({
            msg: "Atleta adicionado com sucesso",
            error: false
        })
    }
}