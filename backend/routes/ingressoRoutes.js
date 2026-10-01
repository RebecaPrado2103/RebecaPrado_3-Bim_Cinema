const express = require('express');
const router = express.Router();
const ingressoController = require('../controllers/ingressoController');

// Rotas do CRUD de Ingressos
router.get('/listar', ingressoController.listarIngressos);
router.get('/:id', ingressoController.obterIngresso);
router.post('/', ingressoController.criarIngresso);
router.put('/:id', ingressoController.atualizarIngresso);
router.delete('/:id', ingressoController.deletarIngresso);

module.exports = router;