import './style.css'

const $ = (seletor) => document.querySelector(seletor)
const $$ = (seletor) => document.querySelectorAll(seletor)

const paginasInfo = {
  home: {
    titulo: 'Central de Cálculos',
    subtitulo: 'Escolha uma ferramenta para iniciar.',
  },
  matrizes: {
    titulo: 'Calculadora de Matrizes',
    subtitulo: 'Realize operações básicas entre matrizes.',
  },
  'tabela-verdade': {
    titulo: 'Tabela Verdade',
    subtitulo: 'Monte tabelas a partir de proposições lógicas.',
  },
}

const TEMPO_ERRO = 5500
const TEMPO_SUCESSO = 4000

const tituloPagina = $('#titulo-pagina')
const subtituloPagina = $('#subtitulo-pagina')
const paginas = $$('.app-page')
const linksPagina = $$('[data-page-link]')

const linhasAInput = $('#linhas-a')
const colunasAInput = $('#colunas-a')
const linhasBInput = $('#linhas-b')
const colunasBInput = $('#colunas-b')
const escalarInput = $('#escalar')
const matrizAContainer = $('#matriz-a')
const matrizBContainer = $('#matriz-b')
const resultadoContainer = $('#resultado')
const resultadoMatrizesCard = $('#resultado-matrizes-card')
const mensagemErro = $('#mensagem-erro')
const ajudaErroMatrizes = $('#ajuda-erro-matrizes')
const abrirAjudaErroMatrizesButton = $('#abrir-ajuda-erro-matrizes')
const observacaoDimensoes = $('#observacao-dimensoes')

const proposicaoInput = $('#proposicao-logica')
const mensagemTabela = $('#mensagem-tabela')
const tabelaVerdadeResultado = $('#tabela-verdade-resultado')
const resultadoTabelaCard = $('#resultado-tabela-card')
const resumoTabela = $('#resumo-tabela')
const totalLinhasTabela = $('#total-linhas-tabela')
const totalColunasTabela = $('#total-colunas-tabela')
const variaveisTabela = $('#variaveis-tabela')

const ajudaMatrizesModal = $('#ajuda-matrizes-modal')
const ajudaTabelaModal = $('#ajuda-modal')
const ajudaMatrizesTitulo = ajudaMatrizesModal.querySelector('h2')
const ajudaMatrizesConteudo = ajudaMatrizesModal.querySelector('.help-content')
const ajudaMatrizesPadrao = {
  titulo: ajudaMatrizesTitulo.textContent,
  conteudo: ajudaMatrizesConteudo.innerHTML,
}

let observacaoTimer = null
let erroMatrizTimer = null
let erroTabelaTimer = null
let ajudaErroMatrizesAtual = 'geral'

function paginaAtual() {
  const pagina = window.location.hash.replace('#', '')
  return paginasInfo[pagina] ? pagina : 'home'
}

function atualizarNavegacao() {
  const pagina = paginaAtual()
  const info = paginasInfo[pagina]

  paginas.forEach((secao) => {
    secao.hidden = secao.dataset.page !== pagina
  })

  linksPagina.forEach((link) => {
    link.classList.toggle('ativo', link.dataset.pageLink === pagina)
  })

  tituloPagina.textContent = info.titulo
  subtituloPagina.textContent = info.subtitulo
}

function numeroInteiro(input) {
  return Number.parseInt(input.value, 10)
}

function dimensaoValida(valor) {
  return Number.isInteger(valor) && valor > 0
}

function obterDimensoes() {
  return {
    linhasA: numeroInteiro(linhasAInput),
    colunasA: numeroInteiro(colunasAInput),
    linhasB: numeroInteiro(linhasBInput),
    colunasB: numeroInteiro(colunasBInput),
  }
}

function dimensoesValidas(dimensoes) {
  return (
    dimensaoValida(dimensoes.linhasA) &&
    dimensaoValida(dimensoes.colunasA) &&
    dimensaoValida(dimensoes.linhasB) &&
    dimensaoValida(dimensoes.colunasB)
  )
}

function juntarLista(itens) {
  if (itens.length <= 1) {
    return itens[0] || ''
  }

  if (itens.length === 2) {
    return `${itens[0]} e ${itens[1]}`
  }

  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

function limparObservacao() {
  clearTimeout(observacaoTimer)
  observacaoDimensoes.textContent = ''
  observacaoDimensoes.className = 'observacao-dimensoes'
}

function mostrarObservacao(mensagem, tipo) {
  limparObservacao()
  observacaoDimensoes.textContent = mensagem
  observacaoDimensoes.classList.add(`observacao-${tipo}`)

  const tempo = tipo === 'sucesso' ? TEMPO_SUCESSO : TEMPO_ERRO
  observacaoTimer = setTimeout(limparObservacao, tempo)
}

function montarMensagemDimensoes(dimensoes) {
  const possiveis = ['multiplicar por escalar']
  const impossiveis = []

  if (dimensoes.linhasA === dimensoes.linhasB && dimensoes.colunasA === dimensoes.colunasB) {
    possiveis.unshift('somar', 'subtrair')
  } else {
    impossiveis.push('somar', 'subtrair')
  }

  if (dimensoes.colunasA === dimensoes.linhasB) {
    possiveis.push('multiplicar as matrizes entre si')
  } else {
    impossiveis.push('multiplicar as matrizes entre si')
  }

  if (impossiveis.length === 0) {
    return {
      texto: `Com essas dimensões, é possível ${juntarLista(possiveis)}.`,
      tipo: 'sucesso',
    }
  }

  return {
    texto: `Com essas dimensões, é possível ${juntarLista(possiveis)}. Não é possível ${juntarLista(impossiveis)}.`,
    tipo: 'erro',
  }
}

function atualizarObservacaoDimensoes() {
  const dimensoes = obterDimensoes()

  if (!dimensoesValidas(dimensoes)) {
    mostrarObservacao('As matrizes precisam ter pelo menos 1 linha e 1 coluna.', 'erro')
    return
  }

  const mensagem = montarMensagemDimensoes(dimensoes)
  mostrarObservacao(mensagem.texto, mensagem.tipo)
}

function valoresAntigos(container) {
  const linhas = []

  container.querySelectorAll('tr').forEach((linha) => {
    const valores = []

    linha.querySelectorAll('input').forEach((input) => {
      valores.push(input.value)
    })

    linhas.push(valores)
  })

  return linhas
}

function criarInputMatriz(container, linhas, colunas) {
  const antigos = valoresAntigos(container)
  const tabela = document.createElement('table')
  tabela.className = 'matrix-grid'

  for (let i = 0; i < linhas; i++) {
    const linha = document.createElement('tr')

    for (let j = 0; j < colunas; j++) {
      const celula = document.createElement('td')
      const input = document.createElement('input')

      input.type = 'number'
      input.value = antigos[i]?.[j] ?? '0'
      celula.appendChild(input)
      linha.appendChild(celula)
    }

    tabela.appendChild(linha)
  }

  container.innerHTML = ''
  container.appendChild(tabela)
}

function gerarMatrizes(mostrarMensagem = true) {
  const dimensoes = obterDimensoes()

  if (!dimensoesValidas(dimensoes)) {
    mostrarObservacao('As matrizes precisam ter pelo menos 1 linha e 1 coluna.', 'erro')
    return
  }

  criarInputMatriz(matrizAContainer, dimensoes.linhasA, dimensoes.colunasA)
  criarInputMatriz(matrizBContainer, dimensoes.linhasB, dimensoes.colunasB)
  limparResultadoMatrizes()

  if (mostrarMensagem) {
    atualizarObservacaoDimensoes()
  } else {
    limparObservacao()
  }
}

function lerNumero(input) {
  const valor = Number(input.value)
  return Number.isFinite(valor) ? valor : 0
}

function lerMatriz(container) {
  const matriz = []

  container.querySelectorAll('tr').forEach((linha) => {
    const valores = []

    linha.querySelectorAll('input').forEach((input) => {
      valores.push(lerNumero(input))
    })

    matriz.push(valores)
  })

  return matriz
}

function mesmasDimensoes(matrizA, matrizB) {
  return matrizA.length === matrizB.length && matrizA[0]?.length === matrizB[0]?.length
}

function somarMatrizes(matrizA, matrizB) {
  return matrizA.map((linha, i) => linha.map((valor, j) => valor + matrizB[i][j]))
}

function subtrairMatrizes(matrizA, matrizB) {
  return matrizA.map((linha, i) => linha.map((valor, j) => valor - matrizB[i][j]))
}

function multiplicarPorEscalar(matriz, escalar) {
  return matriz.map((linha) => linha.map((valor) => valor * escalar))
}

function multiplicarMatrizes(matrizA, matrizB) {
  const resultado = []

  for (let i = 0; i < matrizA.length; i++) {
    const linha = []

    for (let j = 0; j < matrizB[0].length; j++) {
      let soma = 0

      for (let k = 0; k < matrizA[0].length; k++) {
        soma += matrizA[i][k] * matrizB[k][j]
      }

      linha.push(soma)
    }

    resultado.push(linha)
  }

  return resultado
}

function obterAjudaErroMatriz(tipo) {
  const ajudas = {
    soma: {
      titulo: 'Por que não dá para somar?',
      texto:
        'A soma só funciona quando a Matriz A e a Matriz B têm exatamente o mesmo número de linhas e colunas.',
      tabela: [
        ['2x2 + 2x2', 'Possível', 'As posições das duas matrizes coincidem.'],
        ['2x3 + 3x2', 'Impossível', 'As linhas e colunas não têm o mesmo formato.'],
      ],
    },
    subtracao: {
      titulo: 'Por que não dá para subtrair?',
      texto:
        'A subtração segue a mesma regra da soma: cada posição da Matriz A precisa encontrar a mesma posição na Matriz B.',
      tabela: [
        ['3x1 - 3x1', 'Possível', 'Cada elemento tem uma posição correspondente.'],
        ['2x2 - 2x3', 'Impossível', 'A Matriz B tem uma coluna a mais.'],
      ],
    },
    multiplicacao: {
      titulo: 'Por que não dá para multiplicar?',
      texto:
        'Para multiplicar A × B, o número de colunas da Matriz A deve ser igual ao número de linhas da Matriz B.',
      tabela: [
        ['2x3 × 3x2', 'Possível', 'As 3 colunas de A combinam com as 3 linhas de B.'],
        ['2x3 × 2x2', 'Impossível', 'As 3 colunas de A não combinam com as 2 linhas de B.'],
      ],
    },
  }

  return ajudas[tipo] || null
}

function montarTabelaAjudaErro(ajuda) {
  const linhas = ajuda.tabela
    .map(
      (linha) => `
        <tr>
          <td>${linha[0]}</td>
          <td>${linha[1]}</td>
          <td>${linha[2]}</td>
        </tr>
      `,
    )
    .join('')

  return `
    <p>${ajuda.texto}</p>
    <section class="help-notes">
      <h3>Exemplos</h3>
      <div class="matrix-scroll help-table-scroll">
        <table class="help-table matrix-info-table">
          <thead>
            <tr>
              <th>Caso</th>
              <th>Status</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
    </section>
  `
}

function prepararAjudaMatrizes(tipo = 'geral') {
  const ajuda = obterAjudaErroMatriz(tipo)

  if (!ajuda) {
    ajudaMatrizesTitulo.textContent = ajudaMatrizesPadrao.titulo
    ajudaMatrizesConteudo.innerHTML = ajudaMatrizesPadrao.conteudo
    return
  }

  ajudaMatrizesTitulo.textContent = ajuda.titulo
  ajudaMatrizesConteudo.innerHTML = montarTabelaAjudaErro(ajuda)
}

function limparResultadoMatrizes() {
  clearTimeout(erroMatrizTimer)
  mensagemErro.textContent = ''
  ajudaErroMatrizes.hidden = true
  resultadoContainer.innerHTML = ''
  resultadoMatrizesCard.hidden = true
}

function mostrarErroMatriz(mensagem, tipoAjuda) {
  clearTimeout(erroMatrizTimer)
  resultadoContainer.innerHTML = ''
  resultadoMatrizesCard.hidden = false
  mensagemErro.textContent = mensagem
  ajudaErroMatrizesAtual = tipoAjuda || 'geral'
  ajudaErroMatrizes.hidden = !tipoAjuda

  erroMatrizTimer = setTimeout(() => {
    mensagemErro.textContent = ''
    ajudaErroMatrizes.hidden = true
    resultadoMatrizesCard.hidden = true
  }, TEMPO_ERRO)
}

function renderizarResultado(matriz) {
  clearTimeout(erroMatrizTimer)
  mensagemErro.textContent = ''
  ajudaErroMatrizes.hidden = true
  resultadoContainer.innerHTML = ''
  resultadoMatrizesCard.hidden = false

  const tabela = document.createElement('table')
  tabela.className = 'matrix-grid resultado-grid'

  matriz.forEach((linhaMatriz) => {
    const linha = document.createElement('tr')

    linhaMatriz.forEach((valor) => {
      const celula = document.createElement('td')
      celula.textContent = valor
      linha.appendChild(celula)
    })

    tabela.appendChild(linha)
  })

  resultadoContainer.appendChild(tabela)
}

function executarSoma() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)

  if (!mesmasDimensoes(matrizA, matrizB)) {
    atualizarObservacaoDimensoes()
    mostrarErroMatriz('Para somar, as duas matrizes precisam ter as mesmas dimensões.', 'soma')
    return
  }

  renderizarResultado(somarMatrizes(matrizA, matrizB))
}

function executarSubtracao() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)

  if (!mesmasDimensoes(matrizA, matrizB)) {
    atualizarObservacaoDimensoes()
    mostrarErroMatriz(
      'Para subtrair, as duas matrizes precisam ter as mesmas dimensões.',
      'subtracao',
    )
    return
  }

  renderizarResultado(subtrairMatrizes(matrizA, matrizB))
}

function executarMultiplicacaoPorEscalar() {
  const matrizA = lerMatriz(matrizAContainer)
  const escalar = lerNumero(escalarInput)
  renderizarResultado(multiplicarPorEscalar(matrizA, escalar))
}

function executarMultiplicacaoMatrizes() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)

  if (matrizA[0].length !== matrizB.length) {
    atualizarObservacaoDimensoes()
    mostrarErroMatriz(
      'Para multiplicar A por B, as colunas de A devem ser iguais às linhas de B.',
      'multiplicacao',
    )
    return
  }

  renderizarResultado(multiplicarMatrizes(matrizA, matrizB))
}

function limparMatrizes() {
  $$('#matriz-a input, #matriz-b input').forEach((input) => {
    input.value = '0'
  })

  escalarInput.value = '1'
  limparObservacao()
  limparResultadoMatrizes()
}

function semAcento(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function normalizarProposicao(texto) {
  let valor = semAcento(texto)
    .toLowerCase()
    .replace(/[;,]/g, ' ')
    .replace(/\u2194/g, ' <-> ')
    .replace(/\u2192/g, ' -> ')
    .replace(/\u2227/g, ' ^ ')
    .replace(/\u2228/g, ' v ')
    .replace(/&&/g, ' ^ ')
    .replace(/\|\|/g, ' v ')
    .replace(/!/g, ' ~ ')
    .replace(/\bse\s+e\s+somente\s+se\b/g, ' <-> ')
    .replace(/\bse\s+somente\s+se\b/g, ' <-> ')
    .replace(/\bimplica\b/g, ' -> ')
    .replace(/\bentao\b/g, ' -> ')
    .replace(/\bnao\b/g, ' ~ ')
    .replace(/\bnot\b/g, ' ~ ')
    .replace(/\band\b/g, ' ^ ')
    .replace(/\be\b/g, ' ^ ')
    .replace(/\bor\b/g, ' v ')
    .replace(/\bou\b/g, ' v ')
    .replace(/\bv\b/g, ' v ')
    .replace(/(<->|->|[()~^v])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim()

  if (valor.startsWith('se ') && valor.includes(' -> ')) {
    valor = valor.replace(/^se\s+/, '')
  }

  return valor
}

function erroSintaxe(mensagem) {
  return new Error(mensagem)
}

function tokenizar(texto) {
  const tokens = []
  let i = 0

  while (i < texto.length) {
    const caractere = texto[i]

    if (/\s/.test(caractere)) {
      i += 1
      continue
    }

    if (texto.startsWith('<->', i)) {
      tokens.push({ tipo: 'operador', valor: '<->' })
      i += 3
      continue
    }

    if (texto.startsWith('->', i)) {
      tokens.push({ tipo: 'operador', valor: '->' })
      i += 2
      continue
    }

    if ('()~^v'.includes(caractere)) {
      tokens.push({ tipo: 'operador', valor: caractere })
      i += 1
      continue
    }

    if (/[a-z]/.test(caractere)) {
      let palavra = ''

      while (i < texto.length && /[a-z]/.test(texto[i])) {
        palavra += texto[i]
        i += 1
      }

      if (palavra.length > 1) {
        throw erroSintaxe('Use variáveis com apenas uma letra, como p, q ou r.')
      }

      tokens.push({ tipo: 'variavel', valor: palavra })
      continue
    }

    throw erroSintaxe(`Caractere inválido: ${caractere}`)
  }

  return tokens
}

function criarParser(tokens) {
  let posicao = 0

  function atual() {
    return tokens[posicao]
  }

  function consumir(valor) {
    if (atual()?.valor === valor) {
      posicao += 1
      return true
    }

    return false
  }

  function criarNo(tipo, esquerda, direita) {
    return { tipo, esquerda, direita }
  }

  function bicondicional() {
    let no = condicional()

    while (consumir('<->')) {
      no = criarNo('bicondicional', no, condicional())
    }

    return no
  }

  function condicional() {
    const no = ou()

    if (consumir('->')) {
      return criarNo('condicional', no, condicional())
    }

    return no
  }

  function ou() {
    let no = e()

    while (consumir('v')) {
      no = criarNo('ou', no, e())
    }

    return no
  }

  function e() {
    let no = negacao()

    while (consumir('^')) {
      no = criarNo('e', no, negacao())
    }

    return no
  }

  function negacao() {
    if (consumir('~')) {
      return { tipo: 'negacao', valor: negacao() }
    }

    return primario()
  }

  function primario() {
    const token = atual()

    if (!token) {
      throw erroSintaxe('A proposição está incompleta.')
    }

    if (token.tipo === 'variavel') {
      posicao += 1
      return { tipo: 'variavel', nome: token.valor }
    }

    if (consumir('(')) {
      const no = bicondicional()

      if (!consumir(')')) {
        throw erroSintaxe('Feche os parênteses da proposição.')
      }

      return no
    }

    throw erroSintaxe(`Erro de sintaxe perto de "${token.valor}".`)
  }

  function analisar() {
    const no = bicondicional()

    if (atual()) {
      throw erroSintaxe(`Erro de sintaxe perto de "${atual().valor}".`)
    }

    return no
  }

  return { analisar }
}

function variaveisDaProposicao(tokens) {
  const variaveis = []

  tokens.forEach((token) => {
    if (token.tipo === 'variavel' && !variaveis.includes(token.valor)) {
      variaveis.push(token.valor)
    }
  })

  return variaveis.sort()
}

function analisarProposicao(texto) {
  const normalizada = normalizarProposicao(texto)
  const tokens = tokenizar(normalizada)
  const variaveis = variaveisDaProposicao(tokens)

  if (variaveis.length === 0) {
    throw erroSintaxe('Digite ao menos uma variável, como p, q ou r.')
  }

  if (variaveis.length > 8) {
    throw erroSintaxe('Use no máximo 8 variáveis para manter a tabela legível.')
  }

  return {
    arvore: criarParser(tokens).analisar(),
    normalizada,
    variaveis,
  }
}

function avaliar(no, valores) {
  if (no.tipo === 'variavel') {
    return valores[no.nome]
  }

  if (no.tipo === 'negacao') {
    return !avaliar(no.valor, valores)
  }

  const esquerda = avaliar(no.esquerda, valores)
  const direita = avaliar(no.direita, valores)

  if (no.tipo === 'e') {
    return esquerda && direita
  }

  if (no.tipo === 'ou') {
    return esquerda || direita
  }

  if (no.tipo === 'condicional') {
    return !esquerda || direita
  }

  return esquerda === direita
}

function gerarCombinacoes(variaveis) {
  const linhas = []
  const total = 2 ** variaveis.length

  for (let i = 0; i < total; i++) {
    const valores = {}

    for (let j = 0; j < variaveis.length; j++) {
      const deslocamento = variaveis.length - j - 1
      valores[variaveis[j]] = ((i >> deslocamento) & 1) === 0
    }

    linhas.push(valores)
  }

  return linhas
}

function valorLogico(valor) {
  return valor ? 'V' : 'F'
}

function criarCelulaLogica(valor) {
  const celula = document.createElement('td')
  celula.textContent = valorLogico(valor)
  celula.className = valor ? 'valor-verdadeiro' : 'valor-falso'
  return celula
}

function gerarTabelaVerdade(texto) {
  const analise = analisarProposicao(texto)
  const linhas = gerarCombinacoes(analise.variaveis).map((valores) => ({
    valores,
    resultado: avaliar(analise.arvore, valores),
  }))

  return {
    ...analise,
    linhas,
  }
}

function limparErroTabela() {
  clearTimeout(erroTabelaTimer)
  mensagemTabela.textContent = ''
}

function limparTabelaVerdade() {
  proposicaoInput.value = ''
  limparErroTabela()
  tabelaVerdadeResultado.innerHTML = ''
  resumoTabela.hidden = true
  resultadoTabelaCard.hidden = true
}

function mostrarErroTabela(mensagem) {
  clearTimeout(erroTabelaTimer)
  tabelaVerdadeResultado.innerHTML = ''
  resumoTabela.hidden = true
  resultadoTabelaCard.hidden = false
  mensagemTabela.textContent = mensagem

  erroTabelaTimer = setTimeout(() => {
    mensagemTabela.textContent = ''
    resultadoTabelaCard.hidden = true
  }, TEMPO_ERRO)
}

function renderizarTabelaVerdade(tabela) {
  limparErroTabela()
  tabelaVerdadeResultado.innerHTML = ''
  resultadoTabelaCard.hidden = false
  resumoTabela.hidden = false
  totalLinhasTabela.textContent = tabela.linhas.length
  totalColunasTabela.textContent = tabela.variaveis.length + 1
  variaveisTabela.textContent = tabela.variaveis.join(', ')

  const elementoTabela = document.createElement('table')
  const cabecalho = document.createElement('thead')
  const corpo = document.createElement('tbody')
  const linhaCabecalho = document.createElement('tr')

  elementoTabela.className = 'truth-table'

  tabela.variaveis.forEach((variavel) => {
    const coluna = document.createElement('th')
    coluna.textContent = variavel
    linhaCabecalho.appendChild(coluna)
  })

  const colunaResultado = document.createElement('th')
  colunaResultado.textContent = tabela.normalizada
  linhaCabecalho.appendChild(colunaResultado)
  cabecalho.appendChild(linhaCabecalho)

  tabela.linhas.forEach((linhaTabela) => {
    const linha = document.createElement('tr')

    tabela.variaveis.forEach((variavel) => {
      linha.appendChild(criarCelulaLogica(linhaTabela.valores[variavel]))
    })

    linha.appendChild(criarCelulaLogica(linhaTabela.resultado))
    corpo.appendChild(linha)
  })

  elementoTabela.appendChild(cabecalho)
  elementoTabela.appendChild(corpo)
  tabelaVerdadeResultado.appendChild(elementoTabela)
}

function executarTabelaVerdade() {
  const proposicao = proposicaoInput.value.trim()

  if (!proposicao) {
    mostrarErroTabela('Digite uma proposição antes de gerar a tabela.')
    return
  }

  try {
    renderizarTabelaVerdade(gerarTabelaVerdade(proposicao))
  } catch (erro) {
    mostrarErroTabela(erro.message || 'Não foi possível interpretar a proposição.')
  }
}

function abrirModal(modal) {
  modal.hidden = false
  modal.querySelector('.modal-close')?.focus()
}

function fecharModal(modal) {
  modal.hidden = true
}

function fecharModalClicandoFora(evento, modal) {
  if (evento.target === modal) {
    fecharModal(modal)
  }
}

function abrirAjudaMatrizes(tipo = 'geral') {
  prepararAjudaMatrizes(tipo)
  abrirModal(ajudaMatrizesModal)
}

window.addEventListener('hashchange', atualizarNavegacao)

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    fecharModal(ajudaMatrizesModal)
    fecharModal(ajudaTabelaModal)
  }
})

$('#gerar-matrizes').addEventListener('click', () => gerarMatrizes(true))
$('#somar').addEventListener('click', executarSoma)
$('#subtrair').addEventListener('click', executarSubtracao)
$('#multiplicar-escalar').addEventListener('click', executarMultiplicacaoPorEscalar)
$('#multiplicar-matrizes').addEventListener('click', executarMultiplicacaoMatrizes)
$('#limpar').addEventListener('click', limparMatrizes)

$('#gerar-tabela').addEventListener('click', executarTabelaVerdade)
$('#limpar-tabela').addEventListener('click', limparTabelaVerdade)
proposicaoInput.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    executarTabelaVerdade()
  }
})

$('#ajuda-matrizes').addEventListener('click', () => abrirAjudaMatrizes('geral'))
abrirAjudaErroMatrizesButton.addEventListener('click', () => {
  abrirAjudaMatrizes(ajudaErroMatrizesAtual)
})
$('#fechar-ajuda-matrizes').addEventListener('click', () => fecharModal(ajudaMatrizesModal))
ajudaMatrizesModal.addEventListener('click', (evento) => {
  fecharModalClicandoFora(evento, ajudaMatrizesModal)
})

$('#ajuda-tabela').addEventListener('click', () => abrirModal(ajudaTabelaModal))
$('#fechar-ajuda').addEventListener('click', () => fecharModal(ajudaTabelaModal))
ajudaTabelaModal.addEventListener('click', (evento) => {
  fecharModalClicandoFora(evento, ajudaTabelaModal)
})

gerarMatrizes(false)
atualizarNavegacao()
