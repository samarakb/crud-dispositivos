// ============================================================
// CONSTANTES
// ============================================================

const URL_API = 'https://restful-apidevcloe.vercel.app/objects';

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
  // 1. Limpar TODAS as linhas antigas da tabela
  // (innerHTML = '' apaga todo o conteúdo interno do <tbody>)
  corpoTabela.innerHTML = '';

  // 2. Para cada item do vetor, criar uma linha <tr> na tabela
  for (let i = 0; i < dispositivos.length; i++) {
    const item = dispositivos[i];

    // 2a. Criar o elemento <tr> (linha da tabela)
    const linha = document.createElement('tr');

    // 2b. Criar cada célula <td> e preenchê-la
    const celulaId = document.createElement('td');
    celulaId.textContent = item.id;

    const celulaNome = document.createElement('td');
    celulaNome.textContent = item.name;

    // IMPORTANTE: verificar se item.data existe antes de acessar propriedades
    const celulaCor = document.createElement('td');
    if (item.data && item.data.color) {
      celulaCor.textContent = item.data.color;
    } else {
      celulaCor.textContent = '—';
    }

    const celulaCapacidade = document.createElement('td');
    if (item.data && item.data.capacity) {
      celulaCapacidade.textContent = item.data.capacity;
    } else {
      celulaCapacidade.textContent = '—';
    }

    const celulaPreco = document.createElement('td');
    if (item.data && item.data.price) {
      // Formatar o preço em reais (R$) com duas casas decimais
      celulaPreco.textContent = item.data.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    } else {
      celulaPreco.textContent = '—';
    }

    // 2c. Anexar as células à linha
    linha.appendChild(celulaId);
    linha.appendChild(celulaNome);
    linha.appendChild(celulaCor);
    linha.appendChild(celulaCapacidade);
    linha.appendChild(celulaPreco);

    // 2d. Anexar a linha ao corpo da tabela
    corpoTabela.appendChild(linha);
  }
}

// ============================================================
// CRUD - PASSO 1
// ============================================================

async function listarDispositivos() {
  try {
    // 1. Fazer a requisição GET para a API
    // (GET é o método padrão do fetch — não precisamos configurá-lo)
    const respostaHTTP = await fetch(URL_API);

    // 2. Converter a resposta HTTP em um objeto JavaScript
    // (a API retorna texto JSON, o .json() transforma em objeto)
    const dados = await respostaHTTP.json();

    // 3. Salvar os dados no vetor local
    dispositivos = dados;

    // 4. Redesenhar a tabela com os novos dados
    renderizar();

    // 5. Informar o usuário
    mostrarMensagem(dispositivos.length + ' dispositivos encontrados');
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