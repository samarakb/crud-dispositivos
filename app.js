// ============================================================
// CONSTANTES
// ============================================================

const URL_API = 'https://api.restful-api.dev/objects';

// ============================================================
// VETOR LOCAL
// ============================================================

let dispositivos = [];

// ============================================================
// REFERÊNCIAS AO DOM
// ============================================================

const campoId         = document.getElementById('campoId');
const campoNome       = document.getElementById('campoNome');
const campoCor        = document.getElementById('campoCor');
const campoCapacidade = document.getElementById('campoCapacidade');
const campoPreco      = document.getElementById('campoPreco');

const corpoTabela     = document.getElementById('corpoTabela');
const divMensagem     = document.getElementById('mensagem');

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function mostrarMensagem(texto, tipo) {
  divMensagem.textContent = texto;
  divMensagem.className = tipo;
}

function limparFormulario() {
  campoId.value = '';
  campoNome.value = '';
  campoCor.value = '';
  campoCapacidade.value = '';
  campoPreco.value = '';
}

// ============================================================
// RENDERIZAR TABELA
// ============================================================

function renderizar() {
  corpoTabela.innerHTML = '';

  for (let i = 0; i < dispositivos.length; i++) {
    const item = dispositivos[i];

    const linha = document.createElement('tr');

    const celulaId = document.createElement('td');
    celulaId.textContent = item.id;

    const celulaNome = document.createElement('td');
    celulaNome.textContent = item.name;

    const celulaCor = document.createElement('td');
    celulaCor.textContent =
      item.data && item.data.color ? item.data.color : '—';

    const celulaCapacidade = document.createElement('td');
    celulaCapacidade.textContent =
      item.data && item.data.capacity ? item.data.capacity : '—';

    const celulaPreco = document.createElement('td');
    if (item.data && item.data.price) {
      celulaPreco.textContent = item.data.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    } else {
      celulaPreco.textContent = '—';
    }

    linha.appendChild(celulaId);
    linha.appendChild(celulaNome);
    linha.appendChild(celulaCor);
    linha.appendChild(celulaCapacidade);
    linha.appendChild(celulaPreco);

    corpoTabela.appendChild(linha);
  }
}

// ============================================================
// CRUD - PASSO 1
// ============================================================

async function listarDispositivos() {
  try {
    const respostaHTTP = await fetch(URL_API);
    const dados = await respostaHTTP.json();

    dispositivos = dados;

    renderizar();

    mostrarMensagem(dispositivos.length + ' dispositivos encontrados.', 'sucesso');
  } catch (erro) {
    mostrarMensagem('Erro ao listar: ' + erro.message, 'erro');
  }
}

// ============================================================
// FUNÇÕES (AINDA NÃO IMPLEMENTADAS)
// ============================================================

async function buscarPorId() {
  alert('Botão BUSCAR POR ID clicado!');
}

async function cadastrarDispositivo() {
  alert('Botão CADASTRAR clicado!');
}

async function atualizarDispositivo() {
  alert('Botão ATUALIZAR clicado!');
}

async function excluirDispositivo() {
  alert('Botão EXCLUIR clicado!');
}

// ============================================================
// EVENT LISTENERS (CORRIGIDO - isso tava quebrado no PDF)
// ============================================================

document.getElementById('btnListar')
  .addEventListener('click', listarDispositivos);

document.getElementById('btnBuscar')
  .addEventListener('click', buscarPorId);

document.getElementById('btnCadastrar')
  .addEventListener('click', cadastrarDispositivo);

document.getElementById('btnAtualizar')
  .addEventListener('click', atualizarDispositivo);

document.getElementById('btnExcluir')
  .addEventListener('click', excluirDispositivo);