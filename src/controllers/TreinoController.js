const connection = require('../database/connection');
const WeekNumber = require('../helpers/GetWeekNumber');

module.exports = {
    async create(req, res){
        const { data, tipo_treino_id, periodizacao_id, psr, bem_estar, pse_treinador, pse, duracao, cmj, sj } = req.body

        let monotonia
        let semana = WeekNumber.getWeekNumber(data)
        let training_load = duracao * pse
        let strain_dia
        let pessoa_id = 2

        const dados = 
            await connection('treino')
            .select('treino.id', 'treino.data', 'treino.semana', 'treino.tipo_treino_id', 'treino.periodizacao_id', 'treino.psr', 'treino.bem_estar', 'treino.pse', 'treino.duracao', 'treino.training_load', 'treino.monotonia', 'treino.strain_dia', 'treino.cmj', 'treino.sj')
            .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')
            .where('semana', semana)
            .andWhere('pessoa_id', pessoa_id);

        if(dados.length <= 0){
            strain_dia = 0
            monotonia = 0

            await connection('treino').insert({
                data,
                semana,
                tipo_treino_id,
                periodizacao_id,
                psr,
                bem_estar,
                pse_treinador,
                pse,
                duracao,
                training_load,
                monotonia,
                strain_dia,
                cmj, 
                sj
            })
            .returning('id')
            .then(async function(id) {
                const treino_id = id[0]
                await connection('pessoa_has_treino').insert({
                    pessoa_id,
                    treino_id
                });

                return res.status(200).send({
                    msg: "Registro inserido com sucesso",
                    error: false
                })
            })
        } else {
            const training_load_arr = []
            
            training_load_arr.push(training_load);

            for(let treino in dados){

                training_load_arr.push(parseInt(dados[treino].training_load));

                const reducer = (acumulador, currValue) => acumulador + currValue
                const training_load_arr_somado = training_load_arr.reduce(reducer);

                const training_load_media = training_load_arr_somado / training_load_arr.length

                let desvio_padrao_arr = []
                
                for(let value of training_load_arr){
                    let base_calculo = parseInt(value) - parseInt(training_load_media)
                    let potencia = Math.pow(base_calculo, 2)

                    desvio_padrao_arr.push(potencia)
                }

                let reduce_desvio_padrao = desvio_padrao_arr.reduce(reducer);

                let calculo_desvio_padrao = reduce_desvio_padrao / (training_load_arr.length - 1)

                let raiz_desvio_padrao = Math.sqrt(calculo_desvio_padrao);

                const calculo_monotonia =  raiz_desvio_padrao / training_load_media;
                const calculo_strain_dia = parseInt(dados[treino].training_load) * calculo_monotonia

                for(let treino in dados){
                    await connection('treino')
                    .update({
                        'monotonia': calculo_monotonia,
                        'strain_dia': calculo_strain_dia                
                    })
                    .where('id', dados[treino].id)
                }                
            }

            const lastInsert = await connection('treino')
                .select('treino.id', 'treino.monotonia')
                .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')
                .where('semana', semana)
                .andWhere('pessoa_id', pessoa_id)
                .orderBy('id', "desc")
                .limit(1)

            await connection('treino')
            .insert({
                data,
                semana,
                tipo_treino_id,
                periodizacao_id,
                psr,
                bem_estar,
                pse_treinador,
                pse,
                duracao,
                training_load,
                monotonia: lastInsert[0].monotonia,
                strain_dia: (training_load * lastInsert[0].monotonia),
                cmj, 
                sj
            })
            .returning('id')
            .then(async function(id) {
                const treino_id = id[0]
                await connection('pessoa_has_treino').insert({
                    pessoa_id,
                    treino_id
                });

                return res.status(200).send({
                    msg: "Registro inserido com sucesso",
                    error: false
                })
            })

            const GetAllDataForUpdate = 
                await connection('treino')
                .select('treino.id', 'treino.data', 'treino.semana', 'treino.tipo_treino_id', 'treino.periodizacao_id', 'treino.psr', 'treino.bem_estar', 'treino.pse', 'treino.duracao', 'treino.training_load', 'treino.monotonia', 'treino.strain_dia', 'treino.cmj', 'treino.sj')
                .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')
                .where('semana', semana)
                .andWhere('pessoa_id', pessoa_id);

            for(let treino in GetAllDataForUpdate){
                await connection('treino')
                    .update({
                        'strain_dia': GetAllDataForUpdate[treino].monotonia * GetAllDataForUpdate[treino].training_load                
                    })
                    .where('id', GetAllDataForUpdate[treino].id)
            }
        }
    },

    async index(req, res){

        const treinos = await 
        connection('treino')
        .select('*')
        .join('pessoa_has_treino', 'treino_id', '=', 'treino.id');

        res.status(200).send(treinos);
    },

    async getById(req, res){

        const { id } = req.params;

        const treino = await 
        connection('treino')
        .select('*')
        .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')
        .where('treino.id', id);

        res.status(200).send(treino);
    },

    async getByAtletaId(req, res){
        const { atletaId, filtro_semana, filtro_data, filtro_tipo_treino, filtro_periodizacao } = req.params

        const filters = {
            semana: filtro_semana,
            tipo_treino: filtro_tipo_treino,
            fase_periodizacao: filtro_periodizacao,
            data: filtro_data
        }

        const treinos = await connection('treino')        
        .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')
        .join('tipo_treino', 'tipo_treino.id', '=', 'treino.tipo_treino_id')
        .where((qb) => {
            qb.where('pessoa_has_treino.pessoa_id', atletaId)

            if(filters.semana != 'null') {
                qb.andWhere('treino.semana', filters.semana)
            }

            if(filters.tipo_treino != 'null') {
                qb.andWhere('treino.tipo_treino_id', filters.tipo_treino)
            }

            if(filters.fase_periodizacao != 'null') {
                qb.andWhere('treino.periodizacao_id', filters.fase_periodizacao)
            }

            if(filters.data != 'null') {
                qb.andWhere('treino.data', filters.data)
            }
        });

        const tipo_treino_groupby = await connection('treino')
        .select('tipo_treino.tipo_treino')   
        .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')
        .join('tipo_treino', 'tipo_treino.id', '=', 'treino.tipo_treino_id')
        .where('pessoa_has_treino.pessoa_id', atletaId)
        .count('treino.id')
        .groupBy('tipo_treino.tipo_treino')

        const datas = await connection('treino').select('pessoa_has_treino.treino_id', 'treino.data')
        .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')

        const semanas = await connection('treino').select('pessoa_has_treino.treino_id', 'treino.semana')
        .join('pessoa_has_treino', 'treino_id', '=', 'treino.id')

        console.log(datas)

        const tipo_treino_array = []
        tipo_treino_array.push(["Tipo treino", "Quantidade"])

        for(let groupby in tipo_treino_groupby){
            tipo_treino_array.push([tipo_treino_groupby[groupby].tipo_treino, tipo_treino_groupby[groupby].count])
        }
        

        res.status(200).send([treinos, tipo_treino_array, datas, semanas])
        
    }
}