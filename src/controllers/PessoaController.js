const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res){
        const pessoa = await connection('pessoa')
        .select('pessoa.id', 'pessoa.nome_completo', 'pessoa.email', 'tipo_pessoa.tipo_pessoa')

        res.status(200).send(pessoa)
    },

    async create(req, res){
        const { nome_completo, email, senha, confirmar_senha } = req.body;


        function addZeroToNumber(number){
            if(number < 10){
                return '0'+number
            }

            return number
        }

        const date = new Date();
        const day = addZeroToNumber(date.getDate());
        const month = addZeroToNumber(date.getMonth() + 1);
        const year = date.getFullYear();
        
        const criado_em = `${year}-${month}-${day}`

        console.log(criado_em);

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
            nome_completo,
            email,
            senha: cryptSenha,
            criado_em: date
        })

        return res.json({
            msg: "Registro inserido com sucesso",
            error: false
        })
    },

    async getById(req, res){
        const { id } = req.params;

        const pessoa = 
            await connection('pessoa')
            .select('id', 'nome_completo', 'email')
            .where('id', id);

        res.status(200).send(pessoa)
    }
}