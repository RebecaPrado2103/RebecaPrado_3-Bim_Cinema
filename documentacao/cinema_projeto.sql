DROP TABLE IF EXISTS FUNCIONARIO, CLIENTE, INGRESSO, PESSOA, FILME, CARGO, GENERO, SALA;

CREATE TABLE SALA(
	id_sala INTEGER PRIMARY KEY,
	nome_sala VARCHAR(20),
	quantidade_lugares INTEGER
);

CREATE TABLE GENERO(
	id_genero INTEGER PRIMARY KEY,
	nome_genero VARCHAR(50)
);

CREATE TABLE CARGO (
    id_cargo INTEGER PRIMARY KEY,
    nome_cargo VARCHAR(80)
);

CREATE TABLE FILME(
	id_filme INTEGER PRIMARY KEY,
	titulo_filme VARCHAR(100),
	id_genero INTEGER,
	id_sala INTEGER,
	FOREIGN KEY(id_genero) REFERENCES GENERO(id_genero),
	FOREIGN KEY(id_sala) REFERENCES SALA(id_sala)
);

CREATE TABLE PESSOA (
    cpf_pessoa VARCHAR(11) PRIMARY KEY,
    nome_pessoa VARCHAR (50),
    data_nascimento_pessoa date,
    endereco_pessoa VARCHAR(150),
    senha_pessoa VARCHAR(50),
    email_pessoa VARCHAR(50)
);

CREATE TABLE INGRESSO(
	id_ingresso INTEGER PRIMARY KEY,
	tipo_ingresso VARCHAR(80),
	preco INTEGER
);

CREATE TABLE CLIENTE(
    pessoa_cpf_pessoa VARCHAR(11) PRIMARY KEY,
	renda_cliente DECIMAL(10,2),
    data_cadastro_cliente VARCHAR(10),
    FOREIGN KEY(pessoa_cpf_pessoa) REFERENCES PESSOA(cpf_pessoa)
);

CREATE TABLE FUNCIONARIO (
    pessoa_cpf_pessoa VARCHAR(11),
    salario_funcionario DECIMAL(10,2),
    cargo_id_cargo integer,
    porcentagem_comissao_funcionario DECIMAL(10,2),
	FOREIGN KEY(pessoa_cpf_pessoa) REFERENCES PESSOA(cpf_pessoa),
	FOREIGN KEY(cargo_id_cargo) REFERENCES CARGO(id_cargo)
);


INSERT INTO FILME (id_filme, titulo_filme, id_genero, id_sala)
VALUES(1, 'O Auto da Compadecida', NULL, NULL),
	(2, 'Frozen', NULL, NULL),
	(3, 'Homem-Aranha: De Volta ao Lar', NULL, NULL),
	(4, 'Star Wars: A Vingança dos Sith', NULL, NULL),
	(5, 'Como Eu Era Antes de Você', NULL, NULL);

INSERT INTO INGRESSO (id_ingresso, tipo_ingresso, preco)
VALUES(1, 'Inteira', 30),
	(2, 'Meia-entrada', 15),
	(3, 'Ingresso promocional', 20);

INSERT INTO CARGO (id_cargo, nome_cargo)
VALUES(1, 'Gerente'),
	(2, 'Atendente'),
	(3, 'Caixa'),
	(4, 'Operador de Cinema');

INSERT INTO PESSOA (cpf_pessoa, nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa)
VALUES ('11111111111', 'Ana Souza', '2001-05-12', 'Rua das Flores, 100', 'ana123', 'ana@email.com'),
	('22222222222', 'Carlos Oliveira', '1994-08-25', 'Avenida Brasil, 250', 'carlos123', 'carlos@email.com'),
	('33333333333', 'Mariana Silva', '2006-03-18', 'Rua Paraná, 75', 'mariana123', 'mariana@email.com'),
	('44444444444', 'João Santos', '1985-11-07', 'Rua das Palmeiras, 320', 'joao123', 'joao@email.com'),
	('55555555555', 'Beatriz Costa', '1998-02-14', 'Avenida Central, 180', 'beatriz123', 'beatriz@email.com'),
	('66666666666', 'Lucas Pereira', '1991-09-30', 'Rua São Paulo, 90', 'lucas123', 'lucas@email.com');

INSERT INTO CLIENTE(pessoa_cpf_pessoa, renda_cliente, data_cadastro_cliente)
VALUES('11111111111', 2500.00, '2026-09-01'),
	('22222222222', 3200.00, '2026-09-05'),
	('33333333333', 1800.00, '2026-09-10');

INSERT INTO FUNCIONARIO(pessoa_cpf_pessoa, salario_funcionario, cargo_id_cargo, porcentagem_comissao_funcionario)
VALUES ('44444444444', 3500.00, 1, 5.00),
	('55555555555', 2200.00, 2, 3.00),
	('66666666666', 2500.00, 3, 2.00);
