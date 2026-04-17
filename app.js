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
    mostrarMensagem(dispositivos.length + " dispositivos encontrados", "sucesso");
  } catch (erro) {
    mostrarMensagem("Erro ao listar: " + erro.message, "erro");
  }
}

// ============================================================
// FUNÇÕES (AINDA NÃO IMPLEMENTADAS)
// ============================================================

async function buscarPorId() {
  // 1. Pegar o valor que o usuário digitou no campo ID
  const id = campoId.value.trim();

  // 2. Validar: se o campo está vazio, avisar e parar
  if (!id) {
    mostrarMensagem('Digite um ID para buscar.', 'erro');
    return; // "return" encerra a função aqui
  }

  try {
    // 3. Fazer a requisição GET, agora com o ID na URL
    // (Template Literal: permite inserir variáveis com ${})
    const respostaHTTP = await fetch(`${URL_API}/${id}`);

    // 4. Verificar se a API encontrou o objeto
    if (!respostaHTTP.ok) {
      mostrarMensagem('Dispositivo não encontrado (ID: ' + id + ').', 'erro');
      return;
    }

    // 5. Converter a resposta em objeto JavaScript
    const item = await respostaHTTP.json();

    // 6. Preencher o formulário com os dados retornados
    campoNome.value = item.name || '';

    if (item.data && item.data.color) {
      campoCor.value = item.data.color;
    } else {
      campoCor.value = '';
    }

    if (item.data && item.data.capacity) {
      campoCapacidade.value = item.data.capacity;
    } else {
      campoCapacidade.value = '';
    }

    if (item.data && item.data.price) {
      campoPreco.value = item.data.price;
    } else {
      campoPreco.value = '';
    }

    // 7. Atualizar o vetor local com apenas este item
    dispositivos = [item];
    renderizar();

    mostrarMensagem('Dispositivo "' + item.name + '" encontrado.');
    
  } catch (erro) {
    mostrarMensagem('Erro ao buscar: ' + erro.message, 'erro');
  }
}

async function cadastrarDispositivo() {
  // 1. Ler os valores dos campos do formulário
  const nome = campoNome.value.trim();
  const cor = campoCor.value.trim();
  const capacidade = campoCapacidade.value.trim();
  const preco = campoPreco.value;

  // 2. Validação mínima: nome é obrigatório
  if (!nome) {
    mostrarMensagem('O nome do dispositivo é obrigatório.', 'erro');
    return;
  }

  // 3. Montar o objeto no formato que a API espera
  // parseFloat() converte texto para número decimal
  // Se for inválido, retorna NaN — tratamos isso abaixo
  let precoNumerico = parseFloat(preco);
  if (isNaN(precoNumerico)) {
    precoNumerico = 0;
  }

  const novoDispositivo = {
    name: nome,
    data: {
      color: cor,
      capacity: capacidade,
      price: precoNumerico
    }
  };

  try {
    // 4. Fazer a requisição POST
    const respostaHTTP = await fetch(URL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoDispositivo)
    });

    // 5. Verificar se a resposta foi bem-sucedida
    if (!respostaHTTP.ok) {
      mostrarMensagem(
        'Erro ao cadastrar. A API retornou status ' + respostaHTTP.status,
        'erro'
      );
      return;
    }

    // 6. Converter a resposta (objeto criado pela API)
    const itemCriado = await respostaHTTP.json();

    // 7. Adicionar o novo item ao vetor local
    dispositivos.push(itemCriado);

    // 8. Redesenhar a tabela
    renderizar();

    // 9. Limpar formulário e avisar o usuário
    limparFormulario();
    mostrarMensagem('Dispositivo "' + itemCriado.name + '" cadastrado com sucesso.');
    
  } catch (erro) {
    mostrarMensagem('Erro ao cadastrar: ' + erro.message, 'erro');
  }
}

async function atualizarDispositivo() {
  alert('Botão ATUALIZAR clicado!');
}

async function excluirDispositivo() {
  alert('Botão EXCLUIR clicado!');
}


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