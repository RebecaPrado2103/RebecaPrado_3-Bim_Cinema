const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let ingresso = null;
bloquearAtributos(true);

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/ingresso/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.ingresso : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_ingresso = document.getElementById("inputId_ingresso").value.trim().toUpperCase();
    if (!id_ingresso) {
        mostrarAviso("O ID é obrigatório");
        return;
    }

    document.getElementById("inputId_ingresso").value = id_ingresso;
    ingresso = await procurePorChavePrimaria(id_ingresso);
    oQueEstaFazendo = '';
    
    if (ingresso) {
        mostrarDadosIngresso(ingresso);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite o tipo do ingresso e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite o novo tipo e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_ingresso = document.getElementById("inputId_ingresso").value;
    const tipo_ingresso = document.getElementById("inputTipo_ingresso").value;
    const preco = parseFloat(document.getElementById("inputPreco_ingresso").value);

    const dadosIngresso = { id_ingresso, tipo_ingresso, preco };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/ingresso`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosIngresso) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/ingresso/${id_ingresso}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosIngresso) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/ingresso/${id_ingresso}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_ingresso").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/ingresso/listar`);
        const data = await resposta.json();
        
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.ingressos) {
                texto += `<b>${linha.id_ingresso}</b> - ${linha.tipo_ingresso} - R$${linha.preco}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum tipo de ingresso cadastrado.";
        } else {
            document.getElementById("outputSaida").innerHTML = `Erro no banco: ${data.mensagem}`;
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
        document.getElementById("outputSaida").innerHTML = "Servidor offline ou erro de conexão (CORS).";
    }
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosIngresso(u) {
    document.getElementById("inputId_ingresso").value = u.id_ingresso;
    document.getElementById("inputTipo_ingresso").value = u.tipo_ingresso;
    document.getElementById("inputPreco_ingresso").value = u.preco;
    bloquearAtributos(true);
}

function limparAtributos() {
    ingresso = null;
    oQueEstaFazendo = '';
    document.getElementById("inputTipo_ingresso").value = "";
    document.getElementById("inputPreco_ingresso").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_ingresso").readOnly = !soLeitura;
    document.getElementById("inputTipo_ingresso").readOnly = soLeitura;
    document.getElementById("inputPreco_ingresso").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}