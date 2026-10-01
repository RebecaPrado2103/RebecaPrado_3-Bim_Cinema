const express = require('express');
const router = express.Router();
const salaController = require('../controllers/salaController');

// Rotas do CRUD de Salas
router.get('/listar', salaController.listarSalas);
router.get('/:id', salaController.obterSala);
router.post('/', salaController.criarSala);
router.put('/:id', salaController.atualizarSala);
router.delete('/:id', salaController.deletarSala);

module.exports = router;