const { query } = require('../database');

// Listar todas as sala
exports.listarSalas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM SALA ORDER BY id_sala');
        res.json({ sucesso: true, salas: result.rows });
    } catch (error) {
        console.error('Erro ao listar salas:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar salas' });
    }
};

// Obter sala por ID
exports.obterSala = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID da sala é obrigatório' });
        }

        const result = await query('SELECT * FROM SALA WHERE id_sala = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Sala não encontrada.' });
        }

        res.json({ sucesso: true, sala: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter sala:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar sala
exports.criarSala = async (req, res) => {
    try {
        const { id_sala, nome_sala, quantidade_lugares } = req.body;
        const id = id_sala ? id_sala.trim().toUpperCase() : '';

        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID é obrigatório' });
        }

        if (!nome_sala) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome da sala é obrigatório.' });
        }

        if (!quantidade_lugares) {
            return res.status(400).json({ sucesso: false, mensagem: 'A quantidade de lugares obrigatória.' });
        }

        const sql = `
            INSERT INTO SALA (id_sala, nome_sala, quantidade_lugares)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await query(sql, [id, nome_sala, quantidade_lugares]);
        res.status(201).json({ sucesso: true, mensagem: 'Sala inserida com sucesso!', sala: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Este ID da sala já está cadastrado.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir sala no banco de dados.' });
    }
};

// Atualizar sala
exports.atualizarSala = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        const { nome_sala, quantidade_lugares } = req.body;

        if (!id) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID é obrigatório' });
        }

        const sql = `
            UPDATE SALA 
            SET nome_sala = $1,
            quantidade_lugares = $2
            WHERE id_sala = $3
            RETURNING *
        `;

        const result = await query(sql, [nome_sala, quantidade_lugares, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Sala não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'Sala alterada com sucesso!', sala: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar sala:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar sala.' });
    }
};

// Deletar sala
exports.deletarSala = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';

        if (!id ) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID é obrigatório.' });
        }

        await query('DELETE FROM SALA WHERE id_sala = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Sala excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar sala:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem produtos associados a esta sala.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir sala.' });
    }
};