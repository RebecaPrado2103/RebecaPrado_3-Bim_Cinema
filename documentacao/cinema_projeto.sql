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

INSERT INTO SALA (id_sala, nome_sala, quantidade_lugares)
VALUES (1, 'Sala 1', 120),
       (2, 'Sala 2', 100),
	   (3, 'Sala 3', 80),
	   (4, 'Sala 4', 150),
	   (5, 'Sala 5', 90),
	   (6, 'Sala 6', 110),
	   (7, 'Sala 7', 70),
	   (8, 'Sala 8', 130),
	   (9, 'Sala 9', 100),
	   (10, 'Sala 10', 160);

INSERT INTO GENERO (id_genero, nome_genero)
VALUES (1, 'Ação'),
       (2, 'Aventura'),
	   (3, 'Animação'),
	   (4, 'Comédia'),
	   (5, 'Drama'),
	   (6, 'Fantasia'),
	   (7, 'Ficção Científica'),
	   (8, 'Romance'),
	   (9, 'Terror'),
	   (10, 'Musical');

INSERT INTO FILME (id_filme, titulo_filme, id_genero, id_sala)
VALUES (1, 'O Auto da Compadecida', 4, 1),
       (2, 'Frozen', 3, 2),
	   (3, 'Homem-Aranha: De Volta ao Lar', 1, 3),
	   (4, 'Star Wars: A Vingança dos Sith', 7, 4),
	   (5, 'Como Eu Era Antes de Você', 8, 5),
	   (6, 'Descendentes', 10, 6),
	   (7, 'As Crônicas de Nárnia', 6, 7),
	   (8, 'Mulan', 3, 8),
	   (9, 'Vingadores: Guerra Infinita', 1, 9),
	   (10, 'Como Treinar o Seu Dragão', 2, 10);

INSERT INTO INGRESSO (id_ingresso, tipo_ingresso, preco)
VALUES (1, 'Inteira', 30),
       (2, 'Meia-entrada', 15),
	   (3, 'Ingresso promocional', 20),
	   (4, 'Inteira 3D', 40),
	   (5, 'Meia-entrada 3D', 20),
	   (6, 'Inteira VIP', 50),
	   (7, 'Meia-entrada VIP', 25),
	   (8, 'Ingresso família', 80),
	   (9, 'Ingresso estudante', 15),
	   (10, 'Ingresso infantil', 12);

INSERT INTO CARGO (id_cargo, nome_cargo)
VALUES (1, 'Gerente'),
       (2, 'Atendente'),
	   (3, 'Caixa'),
	   (4, 'Operador de Cinema'),
	   (5, 'Supervisor'),
	   (6, 'Recepcionista'),
	   (7, 'Auxiliar Administrativo'),
	   (8, 'Coordenador'),
	   (9, 'Analista'),
	   (10, 'Assistente');

INSERT INTO PESSOA 
(cpf_pessoa, nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa)
VALUES
('11111111111', 'Ana Souza', '2001-05-12', 'Rua das Flores, 100', 'ana123', 'ana@email.com'),
('22222222222', 'Carlos Oliveira', '1994-08-25', 'Avenida Brasil, 250', 'carlos123', 'carlos@email.com'),
('33333333333', 'Mariana Silva', '2006-03-18', 'Rua Paraná, 75', 'mariana123', 'mariana@email.com'),
('44444444444', 'João Santos', '1985-11-07', 'Rua das Palmeiras, 320', 'joao123', 'joao@email.com'),
('55555555555', 'Beatriz Costa', '1998-02-14', 'Avenida Central, 180', 'beatriz123', 'beatriz@email.com'),
('66666666666', 'Lucas Pereira', '1991-09-30', 'Rua São Paulo, 90', 'lucas123', 'lucas@email.com'),
('77777777777', 'Juliana Martins', '2003-06-22', 'Rua Paraná, 150', 'juliana123', 'juliana@email.com'),
('88888888888', 'Pedro Almeida', '1997-01-15', 'Avenida Brasil, 400', 'pedro123', 'pedro@email.com'),
('99999999999', 'Camila Rodrigues', '2000-10-09', 'Rua das Flores, 250', 'camila123', 'camila@email.com'),
('10101010101', 'Rafael Mendes', '1989-04-27', 'Rua Central, 80', 'rafael123', 'rafael@email.com'),
('12121212121', 'Fernanda Lima', '1992-03-11', 'Rua das Acácias, 120', 'fernanda123', 'fernanda@email.com'),
('13131313131', 'Gabriel Martins', '1988-07-19', 'Avenida Paraná, 500', 'gabriel123', 'gabriel@email.com'),
('14141414141', 'Larissa Alves', '1995-12-03', 'Rua das Palmeiras, 90', 'larissa123', 'larissa@email.com'),
('15151515151', 'Mateus Rocha', '1990-02-28', 'Rua São José, 210', 'mateus123', 'mateus@email.com'),
('16161616161', 'Isabela Ferreira', '1999-05-17', 'Avenida Central, 350', 'isabela123', 'isabela@email.com'),
('17171717171', 'Bruno Carvalho', '1987-10-21', 'Rua Paraná, 420', 'bruno123', 'bruno@email.com'),
('18181818181', 'Amanda Ribeiro', '1996-08-09', 'Rua das Flores, 180', 'amanda123', 'amanda@email.com'),
('19191919191', 'Diego Martins', '1993-04-14', 'Avenida Brasil, 600', 'diego123', 'diego@email.com'),
('20202020202', 'Clara Mendes', '2000-11-26', 'Rua São Paulo, 230', 'clara123', 'clara@email.com'),
('21212121212', 'Thiago Oliveira', '1984-06-05', 'Rua Central, 150', 'thiago123', 'thiago@email.com');

INSERT INTO CLIENTE 
(pessoa_cpf_pessoa, renda_cliente, data_cadastro_cliente)
VALUES
('11111111111', 2500.00, '2026-09-01'),
('22222222222', 3200.00, '2026-09-05'),
('33333333333', 1800.00, '2026-09-10'),
('44444444444', 4500.00, '2026-09-12'),
('55555555555', 2800.00, '2026-09-15'),
('66666666666', 3500.00, '2026-09-18'),
('77777777777', 2200.00, '2026-09-20'),
('88888888888', 4100.00, '2026-09-22'),
('99999999999', 3000.00, '2026-09-25'),
('10101010101', 5200.00, '2026-09-28');

INSERT INTO FUNCIONARIO 
(pessoa_cpf_pessoa, salario_funcionario, cargo_id_cargo, porcentagem_comissao_funcionario)
VALUES
('12121212121', 3500.00, 1, 5.00),
('13131313131', 2200.00, 2, 3.00),
('14141414141', 2500.00, 3, 2.00),
('15151515151', 2800.00, 4, 2.50),
('16161616161', 4200.00, 5, 5.00),
('17171717171', 2100.00, 6, 1.50),
('18181818181', 2300.00, 7, 2.00),
('19191919191', 4500.00, 8, 4.00),
('20202020202', 3000.00, 9, 3.00),
('21212121212', 2600.00, 10, 2.50);