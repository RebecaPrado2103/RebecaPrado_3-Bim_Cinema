const { query } = require('../database');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Listar todos os filmes
exports.listarFilmes = async (req, res) => {
    try {
        const result = await query('SELECT * FROM FILME ORDER BY id_filme');
        res.json({ sucesso: true, filmes: result.rows });
    } catch (error) {
        console.error('Erro ao listar filmes:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar filmes.' });
    }
};

// Obter filme por ID
exports.obterFilme = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM FILME WHERE id_filme = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Filme não encontrado.' });
        }

        res.json({ sucesso: true, filme: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter filme:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar filme
exports.criarFilme = async (req, res) => {
    try {
        const { id_filme, titulo_filme, id_genero, id_sala } = req.body;

        if (!titulo_filme) {
            return res.status(400).json({ sucesso: false, mensagem: 'O título do filme é obrigatório.' });
        }

        const sql = `
            INSERT INTO FILME (id_filme, titulo_filme, id_genero, id_sala)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [
            id_filme,
            titulo_filme,
            id_genero || null,
            id_sala || null
        ];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Filme inserido com sucesso!', filme: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar filme:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O gênero não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir filme no banco de dados.' });
    }
};

// Atualizar filme
exports.atualizarFilme = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { titulo_filme, id_genero, id_sala } = req.body;

        const sql = `
            UPDATE FILME
            SET titulo_filme = $1, 
                id_genero = $2, 
                id_sala = $3
            WHERE id_filme = $4
            RETURNING *
        `;

        const values = [
            titulo_filme,
            id_genero || null,
            id_sala || null,
            id
        ];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Filme não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Filme alterado com sucesso!', filme: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O gênero informada não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar filme.' });
    }
};

// Upload e salvamento de imagem com Sharp
exports.uploadImagem = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo enviado.' });
        }

        const pastaImagens = path.join(__dirname, '../../imagens');
        if (!fs.existsSync(pastaImagens)) {
            fs.mkdirSync(pastaImagens, { recursive: true });
        }

        const caminhoDestino = path.join(pastaImagens, `${id}.png`);

        // Processa e converte para PNG no tamanho ideal
        await sharp(req.file.buffer)
            .resize(300, 300, { fit: 'cover' })
            .toFormat('png')
            .toFile(caminhoDestino);

        res.json({ sucesso: true, mensagem: 'Imagem salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar imagem.' });
    }
};

// Deletar filme
exports.deletarFilme = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM FILME WHERE id_filme = $1', [id]);

        const imgPath = path.join(__dirname, '../../imagens', `${id}.png`);
        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
        }

        res.json({ sucesso: true, mensagem: 'Filme excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar filme:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir filme.' });
    }
};