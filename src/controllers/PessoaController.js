const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res){
        const atletas = await connection('pessoa')
        .select('pessoa.id', 'pessoa.nome_completo', 'pessoa.email', 'tipo_pessoa.tipo_pessoa')
        .join('tipo_pessoa', 'tipo_pessoa.id', '=', 'pessoa.tipo_pessoa_id')
        .where('tipo_pessoa.id', 2)

        res.status(200).send(atletas)
    },

    async create(req, res){
        const { tipo_pessoa_id, nome_completo, email, senha, confirmar_senha } = req.body;


        const findEmail = await connection('pessoa').count('email').where('email', email);

        if(findEmail[0].count > 0){
            return res.json({
                msg: "E-mail já cadastrado",
                error: true
            });
        }

        if(senha.length < 6){
            return res.json({
                msg: "Senha não possui quantidade necessária de caractéres",
                error: true
            });
        }

        if(senha !== confirmar_senha){
            return res.json({
                msg: "Senhas não são iguais",
                error: true
            });
        }

        const cryptSenha = await bcrypt.hash(senha, 10);

        await connection('pessoa').insert({
            tipo_pessoa_id,
            nome_completo,
            email,
            senha: cryptSenha
        })

        return res.json({
            msg: "Registro inserido com sucesso",
            error: false
        })
    },

    async getById(req, res){
        const { id } = req.params;

        const atleta = 
            await connection('pessoa')
            .select('id', 'tipo_pessoa_id', 'nome_completo', 'email')
            .where('id', id);

        res.status(200).send(atleta)
    }
}