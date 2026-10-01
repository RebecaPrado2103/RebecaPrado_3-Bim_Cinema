const { query } = require('../database');

// Listar todos os gêneros
exports.listarGeneros = async (req, res) => {
    try {
        const result = await query('SELECT * FROM GENERO ORDER BY id_genero');
        res.json({ sucesso: true, generos: result.rows });
    } catch (error) {
        console.error('Erro ao listar gêneros:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar gêneros' });
    }
};

// Obter gênero por ID
exports.obterGenero = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID do gênero é obrigatório' });
        }

        const result = await query('SELECT * FROM GENERO WHERE id_genero = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Gênero não encontrado.' });
        }

        res.json({ sucesso: true, genero: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter genero:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar gênero
exports.criarGenero = async (req, res) => {
    try {
        const { id_genero, nome_genero } = req.body;
        const id = id_genero;

        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID é obrigatório' });
        }

        if (!nome_genero) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do gênero é obrigatório.' });
        }

        const sql = `
            INSERT INTO GENERO (id_genero, nome_genero)
            VALUES ($1, $2)
            RETURNING *
        `;

        const result = await query(sql, [id, nome_genero]);
        res.status(201).json({ sucesso: true, mensagem: 'Gênero inserido com sucesso!', genero: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar gênero:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Este ID do gênero já está cadastrado.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir gênero no banco de dados.' });
    }
};

// Atualizar gênero
exports.atualizarGenero = async (req, res) => {
    try {
        const id = req.params.id;
        const { nome_genero} = req.body;

        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID é obrigatório' });
        }

        const sql = `
            UPDATE GENERO 
            SET nome_genero = $1
            WHERE id_genero = $2
            RETURNING *
        `;

        const result = await query(sql, [nome_genero, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Gênero não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Gênero alterado com sucesso!', genero: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar gênero:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar gênero.' });
    }
};

// Deletar gênero
exports.deletarGenero = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id ) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID é obrigatório.' });
        }

        await query('DELETE FROM GENERO WHERE id_genero = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Gênero excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar gênero:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem filmes associados a este gênero.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir gênero.' });
    }
};