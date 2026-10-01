const { query } = require('../database');

// Listar todos os ingressos
exports.listarIngressos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM INGRESSO ORDER BY id_ingresso');
        res.json({ sucesso: true, ingressos: result.rows });
    } catch (error) {
        console.error('Erro ao listar ingressos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar ingressos' });
    }
};

// Obter ingresso por ID
exports.obterIngresso = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID do ingresso é obrigatório' });
        }

        const result = await query('SELECT * FROM INGRESSO WHERE id_ingresso = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Tipo de ingresso não encontrado.' });
        }

        res.json({ sucesso: true, ingresso: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter ingresso:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar ingresso
exports.criarIngresso = async (req, res) => {
    try {
        const { id_ingresso, tipo_ingresso, preco } = req.body;
        const id = id_ingresso;

        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID é obrigatório' });
        }

        if (!tipo_ingresso) {
            return res.status(400).json({ sucesso: false, mensagem: 'O tipo do ingresso é obrigatório.' });
        }

        if (!preco) {
            return res.status(400).json({ sucesso: false, mensagem: 'É obrigatório informar o preço.' });
        }

        const sql = `
            INSERT INTO INGRESSO (id_ingresso, tipo_ingresso, preco)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await query(sql, [id, tipo_ingresso, preco]);
        res.status(201).json({ sucesso: true, mensagem: 'Ingresso inserido com sucesso!', ingresso: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar ingresso:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Este ID do ingresso já está cadastrado.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir ingresso no banco de dados.' });
    }
};

// Atualizar ingresso
exports.atualizarIngresso = async (req, res) => {
    try {
        const id = req.params.id;
        const {tipo_ingresso} = req.body;
        const {preco} = req.body;

        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID é obrigatório' });
        }

        const sql = `
            UPDATE INGRESSO 
            SET tipo_ingresso = $1,
            preco = $2
            WHERE id_ingresso = $3
            RETURNING *
        `;

        const result = await query(sql, [tipo_ingresso, preco, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Ingresso não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Ingresso alterado com sucesso!', ingresso: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar ingresso:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar ingresso.' });
    }
};

// Deletar igresso
exports.deletarIngresso = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id ) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID é obrigatório.' });
        }

        await query('DELETE FROM INGRESSO WHERE id_ingresso = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Ingresso excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar ingresso:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem compras associados a este ingresso.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir ingresso.' });
    }
};