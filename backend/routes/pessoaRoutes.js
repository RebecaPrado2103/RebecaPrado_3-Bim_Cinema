const express = require('express');
const multer = require('multer');
const router = express.Router();
const pessoaController = require('../controllers/pessoaController');

// Configura o Multer para armazenar em memória temporária para o Sharp processar
const upload = multer({ storage: multer.memoryStorage() });

// Rotas do CRUD de Produtos
router.get('/listar', pessoaController.listarPessoas);
router.get('/:cpf', pessoaController.obterPessoa);
router.post('/', pessoaController.criarPessoa);
router.put('/:cpf', pessoaController.atualizarPessoa);
router.delete('/:cpf', pessoaController.deletarPessoa);

// Rota para upload da imagem
router.post('/upload/:cpf', upload.single('imagem'), pessoaController.uploadImagem);

module.exports = router;