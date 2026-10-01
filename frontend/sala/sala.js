const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let sala = null;
bloquearAtributos(true);

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/sala/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.sala : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_sala = document.getElementById("inputId_sala").value.trim().toUpperCase();
    if (!id_sala ) {
        mostrarAviso("O ID é obrigatório");
        return;
    }

    document.getElementById("inputId_sala").value = id_sala;
    sala = await procurePorChavePrimaria(id_sala);
    oQueEstaFazendo = '';
    
    if (sala) {
        mostrarDadosSala(sala);
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
    mostrarAviso("INSERINDO - Digite o nome da sala e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite o novo nome e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_sala = document.getElementById("inputId_sala").value;
    const nome_sala = document.getElementById("inputNome_sala").value;
    const quantidade_lugares = parseInt(document.getElementById("inputQuantidade_lugares").value);

    const dadosSala = { id_sala, nome_sala, quantidade_lugares };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/sala`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosSala) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/sala/${id_sala}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosSala) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/sala/${id_sala}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_sala").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/sala/listar`);
        const data = await resposta.json();
        
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.salas) {
                texto += `<b>${linha.id_sala}</b> - ${linha.nome_sala} - ${linha.quantidade_lugares} lugares<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhuma sala cadastrada.";
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

function mostrarDadosSala(u) {
    document.getElementById("inputId_sala").value = u.id_sala;
    document.getElementById("inputNome_sala").value = u.nome_sala;
    document.getElementById("inputQuantidade_lugares").value = u.quantidade_lugares;
    bloquearAtributos(true);
}

function limparAtributos() {
    sala = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_sala").value = "";
    document.getElementById("inputQuantidade_lugares").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_sala").readOnly = !soLeitura;
    document.getElementById("inputNome_sala").readOnly = soLeitura;
    document.getElementById("inputQuantidade_lugares").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}