const express = require('express');
const multer = require('multer');
const router = express.Router();
const filmeController = require('../controllers/filmeController');

// Configura o Multer para armazenar em memória temporária para o Sharp processar
const upload = multer({ storage: multer.memoryStorage() });

// Rotas do CRUD de Produtos
router.get('/listar', filmeController.listarFilmes);
router.get('/:id', filmeController.obterFilme);
router.post('/', filmeController.criarFilme);
router.put('/:id', filmeController.atualizarFilme);
router.delete('/:id', filmeController.deletarFilme);

// Rota para upload da imagem
router.post('/upload/:id', upload.single('imagem'), filmeController.uploadImagem);

module.exports = router;