const express = require("express");

const router = express.Router()

const PessoaController = require('./controllers/PessoaController');
const TipoTreinoController = require("./controllers/TipoTreinoController");
const TreinoController = require('./controllers/TreinoController');
const PeriodizacaoController = require("./controllers/PeriodizacaoController");

router.post('/pessoa', PessoaController.create);
router.get('/atleta/:id', PessoaController.getById)

router.post('/treino', TreinoController.create);
router.get('/treino', TreinoController.index);
router.get('/treino/:id', TreinoController.getById);
router.get('/treino/atleta/:atletaId/:filtro_semana/:filtro_data/:filtro_tipo_treino/:filtro_periodizacao', TreinoController.getByAtletaId);

router.get('/tipotreino', TipoTreinoController.index);

router.get('/periodizacao', PeriodizacaoController.index);

module.exports = router