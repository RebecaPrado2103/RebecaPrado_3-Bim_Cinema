const { query } = require('../database');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Listar todos as pessoas
exports.listarPessoas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM PESSOA ORDER BY cpf_pessoa');
        res.json({ sucesso: true, pessoas: result.rows });
    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pessoas.' });
    }
};

// Obter pessoa por CPF
exports.obterPessoa = async (req, res) => {
    try {
        const cpf = req.params.cpf;
        if (!cpf) {
            return res.status(400).json({ sucesso: false, mensagem: 'CPF inválido.' });
        }

        const result = await query('SELECT * FROM PESSOA WHERE cpf_pessoa = $1', [cpf]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Pessoa não encontrada.' });
        }

        res.json({ sucesso: true, pessoa: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter pessoa:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar pessoa
exports.criarPessoa = async (req, res) => {
    try {
        const { cpf_pessoa, nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa } = req.body;

        if (!nome_pessoa) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome da pessoa é obrigatório.' });
        }

        if (!email_pessoa) {
            return res.status(400).json({ sucesso: false, mensagem: 'O email é obrigatório' });
        }

        const sql = `
            INSERT INTO PESSOA (cpf_pessoa, nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            cpf_pessoa,
            nome_pessoa,
            data_nascimento_pessoa,
            endereco_pessoa,
            senha_pessoa,
            email_pessoa
        ];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Pessoa inserida com sucesso!', pessoa: result.rows[0] });
    } catch (error) {
        console.error('Erro ao acrescentar pessoa:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O cpf não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir pessoa no banco de dados.' });
    }
};

// Atualizar pessoa
exports.atualizarPessoa = async (req, res) => {
    try {
        const cpf = req.params.cpf;
        const { nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa } = req.body;

        const sql = `
            UPDATE PESSOA
            SET nome_pessoa = $1, 
                data_nascimento_pessoa = $2, 
                endereco_pessoa = $3 
                senha_pessoa = $4
                email_pessoa = $5
            WHERE cpf_pessoa = $6
            RETURNING *
        `;

        const values = [
            nome_pessoa,
            data_nascimento_pessoa,
            endereco_pessoa, 
            senha_pessoa,
            email_pessoa,
            cpf
        ];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Pessoa não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'Pesssoa alterada com sucesso!', pessoa: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O cpf informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar pessoa.' });
    }
};

// Upload e salvamento de imagem com Sharp
exports.uploadImagem = async (req, res) => {
    try {
        const cpf = req.params.cpf;
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo enviado.' });
        }

        const pastaImagens = path.join(__dirname, '../../imagens');
        if (!fs.existsSync(pastaImagens)) {
            fs.mkdirSync(pastaImagens, { recursive: true });
        }

        const caminhoDestino = path.join(pastaImagens, `${cpf}.png`);

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

// Deletar pessoa
exports.deletarPessoa = async (req, res) => {
    try {
        const cpf = req.params.cpf;

        await query('DELETE FROM PESSOA WHERE cpf_pessoa = $1', [cpf]);

        const imgPath = path.join(__dirname, '../../imagens', `${cpf}.png`);
        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
        }

        res.json({ sucesso: true, mensagem: 'Pessoa excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar pessoa:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir pessoa.' });
    }
};