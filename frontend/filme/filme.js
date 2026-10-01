const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let filme = null;
bloquearAtributos(true);

async function inicializar() {
    await carregarGeneros();
    await carregarSalas();
    await listar();
}

async function carregarGeneros() {
    const select = document.getElementById("selectId_genero");
    try {
        const resposta = await fetch(`${URL_API}/genero/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            select.innerHTML = '<option value="">-- Selecione um Gênero --</option>';
            data.generos.forEach(um => {
                select.innerHTML += `<option value="${um.id_genero}">${um.id_genero} - ${um.nome_genero}</option>`;
            });
        }
    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar gêneros</option>';
    }
}

async function carregarSalas() {
    const select = document.getElementById("selectId_sala");
    try {
        const resposta = await fetch(`${URL_API}/sala/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            select.innerHTML = '<option value="">-- Selecione uma Sala--</option>';
            data.salas.forEach(uma => {
                select.innerHTML += `<option value="${uma.id_sala}">${uma.id_sala} - ${uma.nome_sala}</option>`;
            });
        }
    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar salas</option>';
    }
}

function carregarImagem(id) {
    const img = document.getElementById('imgFilme');
    if (!id) {
        img.src = SILHUETA_URL;
        return;
    }
    img.src = `${URL_API}/imagens/${id}.png?t=${new Date().getTime()}`;
    img.onerror = () => { img.src = SILHUETA_URL; };
}

function acionarUpload() {
    if (oQueEstaFazendo !== 'inserindo' && oQueEstaFazendo !== 'alterando') {
        mostrarAviso("Clique em Inserir ou Alterar primeiro para poder escolher uma imagem.");
        return;
    }
    document.getElementById('inputImagem').click();
}

function previewImagem() {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length > 0) {
        const url = URL.createObjectURL(inputFiles[0]);
        document.getElementById('imgFilme').src = url;
        mostrarAviso("Poster escolhido! Clique em Salvar para concluir.");
    }
}

async function uploadImagemParaServidor(id) {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length === 0) return;

    const formData = new FormData();
    formData.append('imagem', inputFiles[0]);

    try {
        await fetch(`${URL_API}/filme/upload/${id}`, {
            method: 'POST',
            body: formData
        });
    } catch (erro) {
        console.error("Erro ao enviar imagem:", erro);
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/filme/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.filme : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_filme = document.getElementById("inputId_filme").value;
    if (isNaN(id_filme) || !Number.isInteger(Number(id_filme)) || id_filme === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    filme = await procurePorChavePrimaria(id_filme);
    oQueEstaFazendo = '';
    
    if (filme) {
        mostrarDadosFilme(filme);
        carregarImagem(id_filme);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        carregarImagem(null);
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos, escolha a imagem e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos, mude a imagem (opcional) e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    let id_filme = document.getElementById("inputId_filme").value;
    const titulo_filme = document.getElementById("inputTitulo_filme").value;
    const id_genero = document.getElementById("selectId_genero").value || null;
    const id_sala = document.getElementById("selectId_sala").value || null;
    

    const dadosFilme = { id_filme, titulo_filme, id_genero, id_sala };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/filme`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosFilme) });
            await uploadImagemParaServidor(id_filme);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/filme/${id_filme}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosFilme) });
            await uploadImagemParaServidor(id_filme);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/filme/${id_filme}`, { method: 'DELETE' });
            carregarImagem(null);
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_filme").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/filme/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.filmes) {
                const um = linha.id_genero ? ` [${linha.id_genero}]` : '';
                const uma = linha.id_sala? ` [${linha.id_sala}]` : '';
                texto += `${linha.id_filme} - ${linha.titulo_filme}${um}${uma}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum filme cadastrado.";
        }
    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Servidor offline.";
    }
}

function cancelarOperacao() {
    limparAtributos();
    carregarImagem(null);
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosFilme(p) {
    document.getElementById("inputId_filme").value = p.id_filme;
    document.getElementById("inputTitulo_filme").value = p.titulo_filme;
    document.getElementById("selectId_genero").value = p.id_genero || "";
    document.getElementById("selectId_sala").value = p.id_sala || "";
    bloquearAtributos(true);
}

function limparAtributos() {
    filme = null;
    oQueEstaFazendo = '';
    document.getElementById("inputTitulo_filme").value = "";
    document.getElementById("selectId_genero").value = "";
    document.getElementById("selectId_sala").value = "";
    document.getElementById("inputImagem").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_filme").readOnly = !soLeitura;
    document.getElementById("inputTitulo_filme").readOnly = soLeitura;
    document.getElementById("selectId_genero").disabled = soLeitura;
    document.getElementById("selectId_sala").disabled = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}