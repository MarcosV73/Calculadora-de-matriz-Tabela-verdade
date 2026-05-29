import './style.css'
import logoMathLogicUrl from './assets/logo/mathlogic-logo.png'
import faviconMathLogicUrl from './assets/logo/mathlogic-favicon.svg'
import faviconMathLogicPngUrl from './assets/logo/mathlogic-favicon.png'

const selecionar = (seletor) => document.querySelector(seletor)
const selecionarTodos = (seletor) => document.querySelectorAll(seletor)

const linhasAInput = selecionar('#linhas-a')
const colunasAInput = selecionar('#colunas-a')
const linhasBInput = selecionar('#linhas-b')
const colunasBInput = selecionar('#colunas-b')
const escalarInput = selecionar('#escalar')

const matrizAContainer = selecionar('#matriz-a')
const matrizBContainer = selecionar('#matriz-b')
const resultadoContainer = selecionar('#resultado')
const resultadoMatrizesCard = selecionar('#resultado-matrizes-card')
const mensagemErro = selecionar('#mensagem-erro')
const observacaoDimensoes = selecionar('#observacao-dimensoes')
const aviso = selecionar('#aviso')
const favicon = selecionar('#favicon')
const faviconPng = selecionar('#favicon-png')
const mathlogicLogo = selecionar('#mathlogic-logo')
const temaEscuroInput = selecionar('#tema-escuro')
const tituloPagina = selecionar('#titulo-pagina')
const subtituloPagina = selecionar('#subtitulo-pagina')
const paginas = selecionarTodos('.app-page')
const linksPagina = selecionarTodos('[data-page-link]')
const menuToggleButton = selecionar('#menu-toggle')
const appNav = selecionar('#app-nav')

const gerarMatrizesButton = selecionar('#gerar-matrizes')
const somarButton = selecionar('#somar')
const subtrairButton = selecionar('#subtrair')
const multiplicarEscalarButton = selecionar('#multiplicar-escalar')
const multiplicarMatrizesButton = selecionar('#multiplicar-matrizes')
const limparButton = selecionar('#limpar')
const ajudaMatrizesButton = selecionar('#ajuda-matrizes')
const acoesObservacaoMatrizes = selecionar('#acoes-observacao-matrizes')
const saberMaisObservacaoMatrizesButton = selecionar('#saber-mais-observacao-matrizes')
const acoesErroMatrizes = selecionar('#acoes-erro-matrizes')
const saberMaisErroMatrizesButton = selecionar('#saber-mais-erro-matrizes')
const ajudaMatrizesModal = selecionar('#ajuda-matrizes-modal')
const fecharAjudaMatrizesButton = selecionar('#fechar-ajuda-matrizes')
const ajudaMatrizesTitulo = selecionar('#ajuda-matrizes-titulo')
const ajudaMatrizesSubtitulo = selecionar('#ajuda-matrizes-subtitulo')
const ajudaMatrizesConteudo = selecionar('#ajuda-matrizes-conteudo')
const proposicaoInput = selecionar('#proposicao-logica')
const gerarTabelaButton = selecionar('#gerar-tabela')
const limparTabelaButton = selecionar('#limpar-tabela')
const ajudaTabelaButton = selecionar('#ajuda-tabela')
const ajudaModal = selecionar('#ajuda-modal')
const fecharAjudaButton = selecionar('#fechar-ajuda')
const mensagemTabela = selecionar('#mensagem-tabela')
const acoesErroTabela = selecionar('#acoes-erro-tabela')
const saberMaisErroTabelaButton = selecionar('#saber-mais-erro-tabela')
const ajudaTabelaTitulo = selecionar('#ajuda-titulo')
const ajudaTabelaSubtitulo = selecionar('#ajuda-modal .modal-header p')
const ajudaTabelaConteudo = selecionar('#ajuda-tabela-conteudo')
const resumoTabela = selecionar('#resumo-tabela')
const totalLinhasTabela = selecionar('#total-linhas-tabela')
const totalColunasTabela = selecionar('#total-colunas-tabela')
const variaveisTabela = selecionar('#variaveis-tabela')
const tabelaVerdadeResultado = selecionar('#tabela-verdade-resultado')
const resultadoTabelaCard = selecionar('#resultado-tabela-card')
const ajudaTabelaPadrao = {
  titulo: ajudaTabelaTitulo.textContent,
  subtitulo: ajudaTabelaSubtitulo.textContent,
  conteudo: ajudaTabelaConteudo.innerHTML,
}
const TEMA_STORAGE_KEY = 'calculadora-matrizes-tema'
const TEMPO_MENSAGEM_ERRO = 5500
const TEMPO_SAIDA_MENSAGEM = 260
const paginasInfo = {
  home: {
    titulo: 'Central de Cálculos',
    subtitulo: 'Escolha uma ferramenta para iniciar.',
  },
  matrizes: {
    titulo: 'Calculadora de Matrizes',
    subtitulo: 'Realize operações básicas entre matrizes de forma simples.',
  },
  'tabela-verdade': {
    titulo: 'Tabela Verdade',
    subtitulo: 'Construa tabelas-verdade de proposições simples e compostas.',
  },
}

let avisoTimer = null
let avisoSaidaTimer = null
const mensagemTimers = {}
const modalTimers = {}
let audioContext = null
let contextoAjudaMatrizes = 'geral'
let ajudaErroTabelaAtual = null

function carregarIdentidadeVisual() {
  favicon.href = faviconMathLogicUrl
  faviconPng.href = faviconMathLogicPngUrl
  mathlogicLogo.src = logoMathLogicUrl
}

function cancelarMensagemTemporaria(chave, elemento, acao = null) {
  const timers = mensagemTimers[chave]

  if (timers) {
    clearTimeout(timers.timer)
    clearTimeout(timers.saidaTimer)
    delete mensagemTimers[chave]
  }

  elemento.classList.remove('mensagem-saindo')

  if (acao) {
    acao.classList.remove('mensagem-saindo')
  }
}

function agendarMensagemTemporaria(chave, elemento, limpar, acao = null) {
  cancelarMensagemTemporaria(chave, elemento, acao)

  mensagemTimers[chave] = {
    timer: setTimeout(() => {
      elemento.classList.add('mensagem-saindo')

      if (acao && !acao.hidden) {
        acao.classList.add('mensagem-saindo')
      }

      mensagemTimers[chave].saidaTimer = setTimeout(() => {
        limpar()
        elemento.classList.remove('mensagem-saindo')

        if (acao) {
          acao.classList.remove('mensagem-saindo')
        }

        delete mensagemTimers[chave]
      }, TEMPO_SAIDA_MENSAGEM)
    }, TEMPO_MENSAGEM_ERRO),
    saidaTimer: null,
  }
}

function obterTemaSalvo() {
  try {
    return localStorage.getItem(TEMA_STORAGE_KEY)
  } catch (erro) {
    return null
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem(TEMA_STORAGE_KEY, tema)
  } catch (erro) {
    console.warn('Nao foi possivel salvar o tema escolhido.', erro)
  }
}

function obterTemaInicial() {
  const temaSalvo = obterTemaSalvo()

  if (temaSalvo === 'claro' || temaSalvo === 'escuro') {
    return temaSalvo
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'escuro'
  }

  return 'claro'
}

function aplicarTema(tema) {
  const temaEscuro = tema === 'escuro'

  document.documentElement.dataset.theme = temaEscuro ? 'dark' : 'light'
  temaEscuroInput.checked = temaEscuro
}

function alternarTema() {
  const tema = temaEscuroInput.checked ? 'escuro' : 'claro'

  aplicarTema(tema)
  salvarTema(tema)
}

function obterPaginaAtual() {
  const pagina = window.location.hash.replace('#', '')

  if (paginasInfo[pagina]) {
    return pagina
  }

  return 'home'
}

function atualizarNavegacao() {
  const paginaAtual = obterPaginaAtual()
  const infoPagina = paginasInfo[paginaAtual]

  for (let i = 0; i < paginas.length; i++) {
    paginas[i].hidden = paginas[i].dataset.page !== paginaAtual
  }

  for (let i = 0; i < linksPagina.length; i++) {
    linksPagina[i].classList.toggle('ativo', linksPagina[i].dataset.pageLink === paginaAtual)
  }

  tituloPagina.textContent = infoPagina.titulo
  subtituloPagina.textContent = infoPagina.subtitulo
  document.title = `${infoPagina.titulo} | Central de Cálculos`
  fecharMenuMobile()
}

function definirMenuMobileAberto(aberto) {
  if (!menuToggleButton || !appNav) {
    return
  }

  appNav.classList.toggle('menu-open', aberto)
  menuToggleButton.classList.toggle('menu-open', aberto)
  menuToggleButton.setAttribute('aria-expanded', aberto ? 'true' : 'false')
  menuToggleButton.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu')
}

function fecharMenuMobile() {
  definirMenuMobileAberto(false)
}

function alternarMenuMobile() {
  if (!appNav) {
    return
  }

  definirMenuMobileAberto(!appNav.classList.contains('menu-open'))
}

function fecharMenuAoClicarFora(evento) {
  if (
    !appNav ||
    !menuToggleButton ||
    !appNav.classList.contains('menu-open') ||
    !window.matchMedia('(max-width: 820px)').matches
  ) {
    return
  }

  if (!appNav.contains(evento.target) && !menuToggleButton.contains(evento.target)) {
    fecharMenuMobile()
  }
}

function lerNumeroInteiro(input) {
  return Number.parseInt(input.value, 10)
}

function dimensaoValida(linhas, colunas) {
  return linhas > 0 && colunas > 0
}

function criarTomSino(frequencia, inicio, duracao, volume, tipo = 'sine') {
  const oscilador = audioContext.createOscillator()
  const ganho = audioContext.createGain()

  oscilador.type = tipo
  oscilador.frequency.setValueAtTime(frequencia, inicio)

  ganho.gain.setValueAtTime(0.001, inicio)
  ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.02)
  ganho.gain.exponentialRampToValueAtTime(0.001, inicio + duracao)

  oscilador.connect(ganho)
  ganho.connect(audioContext.destination)

  oscilador.start(inicio)
  oscilador.stop(inicio + duracao)
}

function tocarSomSucesso() {
  const agora = audioContext.currentTime

  criarTomSino(660, agora, 0.18, 0.12, 'triangle')
  criarTomSino(880, agora + 0.12, 0.2, 0.15, 'triangle')
  criarTomSino(1175, agora + 0.24, 0.28, 0.12, 'sine')
}

function tocarSomErro() {
  const agora = audioContext.currentTime

  criarTomSino(180, agora, 0.28, 0.28, 'square')
  criarTomSino(120, agora + 0.12, 0.34, 0.22, 'sawtooth')
}

function tocarSomAviso(tipo) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext

  if (!AudioContextClass) {
    return
  }

  try {
    if (!audioContext) {
      audioContext = new AudioContextClass()
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => tocarSomAviso(tipo))
      return
    }

    if (tipo === 'sucesso') {
      tocarSomSucesso()
      return
    }

    tocarSomErro()
  } catch (erro) {
    console.warn('Nao foi possivel tocar o alerta sonoro.', erro)
  }
}

// Mostra uma mensagem temporária no canto superior direito da tela.
function obterIconeAviso(tipo) {
  if (tipo === 'sucesso') {
    return '\u2713'
  }

  return '\u2715'
}

function exibirAviso(mensagem, tipo = 'erro') {
  aviso.innerHTML = ''
  aviso.classList.remove('aviso-erro')
  aviso.classList.remove('aviso-sucesso')
  aviso.classList.add(`aviso-${tipo}`)

  const icone = document.createElement('span')
  const texto = document.createElement('span')

  icone.classList.add('aviso-icone')
  texto.classList.add('aviso-texto')

  icone.textContent = obterIconeAviso(tipo)
  texto.textContent = mensagem

  aviso.appendChild(icone)
  aviso.appendChild(texto)
  aviso.classList.remove('rapido')
  aviso.classList.remove('saindo')
  aviso.classList.add('visivel')
  tocarSomAviso(tipo)

  avisoTimer = setTimeout(() => {
    esconderAviso()
  }, tipo === 'erro' ? TEMPO_MENSAGEM_ERRO : 3000)
}

function mostrarAviso(mensagem, tipo = 'erro') {
  clearTimeout(avisoTimer)
  clearTimeout(avisoSaidaTimer)

  if (aviso.classList.contains('visivel')) {
    aviso.classList.add('rapido')
    aviso.classList.add('saindo')

    avisoSaidaTimer = setTimeout(() => {
      aviso.innerHTML = ''
      aviso.classList.remove('visivel')
      aviso.classList.remove('saindo')
      aviso.classList.remove('rapido')
      exibirAviso(mensagem, tipo)
    }, 160)

    return
  }

  exibirAviso(mensagem, tipo)
}

function esconderAviso() {
  clearTimeout(avisoTimer)
  clearTimeout(avisoSaidaTimer)

  if (!aviso.classList.contains('visivel')) {
    return
  }

  aviso.classList.remove('rapido')
  aviso.classList.add('saindo')

  avisoSaidaTimer = setTimeout(() => {
    aviso.innerHTML = ''
    aviso.classList.remove('visivel')
    aviso.classList.remove('saindo')
    aviso.classList.remove('rapido')
  }, 300)
}

function obterOperacoesDisponiveis(linhasA, colunasA, linhasB, colunasB) {
  return {
    somaSubtracao: linhasA === linhasB && colunasA === colunasB,
    multiplicacaoEscalar: true,
    multiplicacaoMatrizes: colunasA === linhasB,
  }
}

function juntarLista(itens) {
  if (itens.length === 0) {
    return ''
  }

  if (itens.length === 1) {
    return itens[0]
  }

  if (itens.length === 2) {
    return `${itens[0]} e ${itens[1]}`
  }

  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

function montarObservacaoDimensoes(linhasA, colunasA, linhasB, colunasB) {
  const operacoes = obterOperacoesDisponiveis(linhasA, colunasA, linhasB, colunasB)
  const operacoesPossiveis = []
  const operacoesIndisponiveis = []

  if (operacoes.somaSubtracao) {
    operacoesPossiveis.push('somar', 'subtrair')
  } else {
    operacoesIndisponiveis.push('somar', 'subtrair')
  }

  operacoesPossiveis.push('multiplicar por escalar')

  if (operacoes.multiplicacaoMatrizes) {
    operacoesPossiveis.push('multiplicar as matrizes entre si')
  } else {
    operacoesIndisponiveis.push('multiplicar as matrizes entre si')
  }

  if (operacoesIndisponiveis.length === 0) {
    return `Com essas dimensões, é possível ${juntarLista(operacoesPossiveis)}.`
  }

  if (operacoesPossiveis.length === 1) {
    return `Com essas dimensões, só é possível ${operacoesPossiveis[0]}. Não é possível ${juntarLista(operacoesIndisponiveis)}.`
  }

  return `Com essas dimensões, é possível ${juntarLista(operacoesPossiveis)}. Não é possível ${juntarLista(operacoesIndisponiveis)}.`
}

function dimensoesTemOperacaoIndisponivel(linhasA, colunasA, linhasB, colunasB) {
  const operacoes = obterOperacoesDisponiveis(linhasA, colunasA, linhasB, colunasB)

  return !operacoes.somaSubtracao || !operacoes.multiplicacaoMatrizes
}

function obterDimensoesAtuais() {
  return {
    linhasA: lerNumeroInteiro(linhasAInput),
    colunasA: lerNumeroInteiro(colunasAInput),
    linhasB: lerNumeroInteiro(linhasBInput),
    colunasB: lerNumeroInteiro(colunasBInput),
  }
}

function formatarDimensao(linhas, colunas) {
  return `${linhas}x${colunas}`
}

function obterContextoAjudaPorDimensoes(linhasA, colunasA, linhasB, colunasB) {
  const operacoes = obterOperacoesDisponiveis(linhasA, colunasA, linhasB, colunasB)

  if (!operacoes.somaSubtracao && !operacoes.multiplicacaoMatrizes) {
    return 'regras'
  }

  if (!operacoes.somaSubtracao) {
    return 'soma-subtracao'
  }

  if (!operacoes.multiplicacaoMatrizes) {
    return 'multiplicacao'
  }

  return ''
}

function atualizarAcaoObservacaoMatrizes(contexto) {
  acoesObservacaoMatrizes.hidden = !contexto

  if (contexto) {
    saberMaisObservacaoMatrizesButton.dataset.contextoAjuda = contexto
  }
}

function atualizarAcaoErroMatrizes(contexto) {
  acoesErroMatrizes.hidden = !contexto

  if (contexto) {
    saberMaisErroMatrizesButton.dataset.contextoAjuda = contexto
  }
}

function limparObservacaoDimensoes() {
  observacaoDimensoes.textContent = ''
  observacaoDimensoes.classList.remove('observacao-dimensoes-alerta')
  observacaoDimensoes.classList.remove('observacao-dimensoes-sucesso')
  atualizarAcaoObservacaoMatrizes('')
}

function definirObservacaoDimensoes(mensagem, temOperacaoIndisponivel = true) {
  cancelarMensagemTemporaria(
    'observacao-dimensoes',
    observacaoDimensoes,
    acoesObservacaoMatrizes,
  )
  observacaoDimensoes.textContent = mensagem
  observacaoDimensoes.classList.remove('observacao-dimensoes-alerta')
  observacaoDimensoes.classList.remove('observacao-dimensoes-sucesso')

  if (!mensagem) {
    atualizarAcaoObservacaoMatrizes('')
    return
  }

  if (temOperacaoIndisponivel) {
    observacaoDimensoes.classList.add('observacao-dimensoes-alerta')
    agendarMensagemTemporaria(
      'observacao-dimensoes',
      observacaoDimensoes,
      limparObservacaoDimensoes,
      acoesObservacaoMatrizes,
    )
    return
  }

  observacaoDimensoes.classList.add('observacao-dimensoes-sucesso')
}

function atualizarObservacaoDimensoes() {
  const linhasA = lerNumeroInteiro(linhasAInput)
  const colunasA = lerNumeroInteiro(colunasAInput)
  const linhasB = lerNumeroInteiro(linhasBInput)
  const colunasB = lerNumeroInteiro(colunasBInput)

  if (!dimensaoValida(linhasA, colunasA) || !dimensaoValida(linhasB, colunasB)) {
    definirObservacaoDimensoes('As matrizes precisam ter pelo menos 1 linha e 1 coluna.')
    atualizarAcaoObservacaoMatrizes('')
    esconderAviso()
    return
  }

  const observacao = montarObservacaoDimensoes(linhasA, colunasA, linhasB, colunasB)
  const temOperacaoIndisponivel = dimensoesTemOperacaoIndisponivel(
    linhasA,
    colunasA,
    linhasB,
    colunasB,
  )

  definirObservacaoDimensoes(observacao, temOperacaoIndisponivel)
  atualizarAcaoObservacaoMatrizes(
    obterContextoAjudaPorDimensoes(linhasA, colunasA, linhasB, colunasB),
  )

  esconderAviso()
}

function criarTextoDimensoesAtuais() {
  const dimensoes = obterDimensoesAtuais()

  if (
    !dimensaoValida(dimensoes.linhasA, dimensoes.colunasA) ||
    !dimensaoValida(dimensoes.linhasB, dimensoes.colunasB)
  ) {
    return 'Ajuste as dimensões para comparar as regras com as matrizes atuais.'
  }

  return `Matriz A: ${formatarDimensao(dimensoes.linhasA, dimensoes.colunasA)}. Matriz B: ${formatarDimensao(dimensoes.linhasB, dimensoes.colunasB)}.`
}

function criarAjudaMatrizes(titulo, subtitulo, conteudo) {
  return { titulo, subtitulo, conteudo }
}

function criarSecaoAjuda(titulo, texto) {
  return `
    <section class="help-notes">
      <h3>${titulo}</h3>
      <p>${texto}</p>
    </section>
  `
}

function criarTabelaAjudaMatrizes(titulo, cabecalhos, linhas) {
  const cabecalhoTabela = cabecalhos.map((cabecalho) => `<th>${cabecalho}</th>`).join('')
  const corpoTabela = linhas
    .map(
      (linha) => `
        <tr>
          ${linha.map((celula) => `<td>${celula}</td>`).join('')}
        </tr>
      `,
    )
    .join('')

  return `
    <section class="help-notes matrix-help-table-section">
      <h3>${titulo}</h3>
      <div class="matrix-scroll help-table-scroll">
        <table class="help-table matrix-info-table">
          <thead>
            <tr>${cabecalhoTabela}</tr>
          </thead>
          <tbody>
            ${corpoTabela}
          </tbody>
        </table>
      </div>
    </section>
  `
}

function criarTabelaRegrasMatrizes() {
  return criarTabelaAjudaMatrizes(
    'Regras das operações',
    ['Tema', 'Regra', 'Como calcula', 'Exemplo'],
    [
      [
        'Dimensão',
        'É escrita como linhas × colunas.',
        'Define quantas posições a matriz possui.',
        '<strong>2x3</strong> tem 2 linhas e 3 colunas.',
      ],
      [
        'Soma',
        'A e B precisam ter a mesma dimensão.',
        'Soma cada posição correspondente: aij + bij.',
        '<strong>2x3 + 2x3</strong> gera uma matriz 2x3.',
      ],
      [
        'Subtração',
        'Usa a mesma regra da soma.',
        'Subtrai cada posição correspondente: aij - bij.',
        '<strong>3x1 - 3x1</strong> gera uma matriz 3x1.',
      ],
      [
        'Escalar',
        'Funciona para qualquer matriz válida.',
        'Multiplica todos os elementos pelo número k.',
        '<strong>k = 2</strong> transforma 1, 3 em 2, 6.',
      ],
      [
        'A × B',
        'As colunas de A devem ser iguais às linhas de B.',
        'Cada célula combina uma linha de A com uma coluna de B.',
        '<strong>2x3 × 3x4</strong> gera uma matriz 2x4.',
      ],
      [
        'Ordem',
        'Em geral, A × B e B × A não são a mesma operação.',
        'A ordem pode mudar a dimensão ou bloquear a conta.',
        '<strong>2x3 × 3x2</strong> e <strong>3x2 × 2x3</strong> geram tamanhos diferentes.',
      ],
    ],
  )
}

function criarTabelaExemplosMatrizes() {
  return criarTabelaAjudaMatrizes(
    'Exemplos rápidos',
    ['Operação', 'Exemplo', 'Status', 'Por quê'],
    [
      ['Soma', '2x2 + 2x2', 'Possível', 'As duas matrizes têm exatamente o mesmo tamanho.'],
      ['Soma', '2x3 + 3x2', 'Impossível', 'As quantidades de linhas e colunas não coincidem.'],
      ['Subtração', '4x1 - 4x1', 'Possível', 'Cada elemento tem uma posição correspondente.'],
      ['Escalar', '5 × matriz 3x2', 'Possível', 'O número multiplica todos os elementos da matriz.'],
      ['A × B', '2x3 × 3x2', 'Possível', 'As 3 colunas de A combinam com as 3 linhas de B.'],
      ['A × B', '2x3 × 2x2', 'Impossível', 'As 3 colunas de A não combinam com as 2 linhas de B.'],
    ],
  )
}

function criarTabelaSomaSubtracaoMatrizes() {
  return criarTabelaAjudaMatrizes(
    'Soma e subtração',
    ['Caso', 'Dimensões', 'Status', 'Detalhe'],
    [
      ['A + B', '2x3 e 2x3', 'Possível', 'O resultado também terá dimensão 2x3.'],
      ['A - B', '3x2 e 3x2', 'Possível', 'Cada elemento de A é combinado com o elemento na mesma posição de B.'],
      ['A + B', '2x3 e 3x2', 'Impossível', 'Mesmo tendo 6 elementos, as posições não formam o mesmo desenho.'],
      ['A - B', '2x2 e 2x3', 'Impossível', 'A Matriz B tem uma coluna extra.'],
      [
        'Célula',
        'mesma linha e mesma coluna',
        'Como calcular',
        'Na soma, c12 = a12 + b12. Na subtração, c12 = a12 - b12.',
      ],
    ],
  )
}

function criarTabelaMultiplicacaoMatrizes() {
  return criarTabelaAjudaMatrizes(
    'Multiplicação entre matrizes',
    ['Caso', 'Regra aplicada', 'Status', 'Resultado'],
    [
      ['2x3 × 3x2', '3 colunas em A = 3 linhas em B', 'Possível', 'A matriz final terá dimensão 2x2.'],
      ['3x2 × 2x4', '2 colunas em A = 2 linhas em B', 'Possível', 'A matriz final terá dimensão 3x4.'],
      ['2x3 × 2x2', '3 colunas em A ≠ 2 linhas em B', 'Impossível', 'Ajuste colunas de A ou linhas de B.'],
      ['4x1 × 1x3', '1 coluna em A = 1 linha em B', 'Possível', 'A matriz final terá dimensão 4x3.'],
      [
        'Célula',
        'linha de A com coluna de B',
        'Como calcular',
        'Cada célula é a soma dos produtos dos pares correspondentes.',
      ],
    ],
  )
}

function criarTabelaEscalarMatrizes() {
  return criarTabelaAjudaMatrizes(
    'Multiplicação por escalar',
    ['Item', 'Regra', 'Exemplo', 'Observação'],
    [
      ['Escalar k', 'É o número escolhido no campo Escalar.', 'k = 2', 'Pode ser positivo, negativo, zero ou decimal.'],
      ['Elemento', 'Cada entrada da matriz é multiplicada por k.', '2 × 5 = 10', 'A conta é feita posição por posição.'],
      ['Dimensão', 'Não muda depois da multiplicação.', '2 × matriz 3x2', 'O resultado continua sendo 3x2.'],
      ['Zero', 'Se k = 0, todos os elementos viram 0.', '0 × matriz A', 'A dimensão continua a mesma.'],
      ['Negativo', 'Se k < 0, os sinais dos elementos podem inverter.', '-1 × 4 = -4', 'Útil para obter a matriz oposta.'],
    ],
  )
}

function criarTabelaRegrasFalhasMatrizes() {
  return criarTabelaAjudaMatrizes(
    'Como corrigir as dimensões',
    ['Operação', 'Precisa de', 'Quando falha', 'Correção'],
    [
      ['Soma', 'A e B com mesmas linhas e colunas.', '2x3 com 3x2.', 'Deixe as duas matrizes como 2x3, 3x2 ou outro tamanho igual.'],
      ['Subtração', 'A e B com o mesmo tamanho.', '2x2 com 2x3.', 'Ajuste linhas e colunas para coincidirem.'],
      ['A × B', 'Colunas de A iguais às linhas de B.', 'A é 2x3 e B é 2x2.', 'Troque B para 3 linhas ou A para 2 colunas.'],
      ['Escalar', 'Matrizes com pelo menos 1 linha e 1 coluna.', 'Dimensão vazia ou menor que 1.', 'Use valores inteiros maiores ou iguais a 1.'],
    ],
  )
}

function criarConteudosAjudaMatrizes(dimensoesAtuais) {
  return {
    geral: criarAjudaMatrizes(
      'Ajuda da Calculadora de Matrizes',
      'Entenda o que é uma matriz e quais regras cada operação precisa seguir.',
      `
        ${criarSecaoAjuda(
          'O que é uma matriz',
          'Uma matriz é uma tabela de números organizada em linhas e colunas. A dimensão 2x3, por exemplo, significa 2 linhas e 3 colunas.',
        )}
        ${criarTabelaRegrasMatrizes()}
        ${criarTabelaExemplosMatrizes()}
      `,
    ),
    'soma-subtracao': criarAjudaMatrizes(
      'Por que não dá para somar ou subtrair?',
      dimensoesAtuais,
      `
        ${criarSecaoAjuda(
          'Regra da soma e da subtração',
          'Para somar ou subtrair matrizes, elas precisam ter exatamente o mesmo número de linhas e colunas. Cada posição da Matriz A é combinada com a mesma posição da Matriz B.',
        )}
        ${criarTabelaSomaSubtracaoMatrizes()}
      `,
    ),
    soma: criarAjudaMatrizes(
      'Por que essa soma não funciona?',
      dimensoesAtuais,
      `
        ${criarSecaoAjuda(
          'Regra da soma',
          'A soma só existe quando as duas matrizes têm as mesmas dimensões. Corrija as linhas e colunas para que Matriz A e Matriz B fiquem iguais.',
        )}
        ${criarTabelaSomaSubtracaoMatrizes()}
      `,
    ),
    subtracao: criarAjudaMatrizes(
      'Por que essa subtração não funciona?',
      dimensoesAtuais,
      `
        ${criarSecaoAjuda(
          'Regra da subtração',
          'A subtração segue a mesma regra da soma: as matrizes precisam ter o mesmo número de linhas e colunas.',
        )}
        ${criarTabelaSomaSubtracaoMatrizes()}
      `,
    ),
    multiplicacao: criarAjudaMatrizes(
      'Por que essa multiplicação não funciona?',
      dimensoesAtuais,
      `
        ${criarSecaoAjuda(
          'Regra da multiplicação entre matrizes',
          'Para multiplicar A × B, o número de colunas da Matriz A deve ser igual ao número de linhas da Matriz B.',
        )}
        ${criarTabelaMultiplicacaoMatrizes()}
      `,
    ),
    escalar: criarAjudaMatrizes(
      'Multiplicação por escalar',
      'Essa operação sempre é possível para qualquer matriz válida.',
      `
        ${criarSecaoAjuda(
          'Como funciona',
          'Multiplicar por escalar significa multiplicar todos os elementos da matriz por um número real.',
        )}
        ${criarTabelaEscalarMatrizes()}
      `,
    ),
    regras: criarAjudaMatrizes(
      'Quais regras falharam?',
      dimensoesAtuais,
      `
        ${criarSecaoAjuda(
          'As dimensões atuais bloqueiam mais de uma operação',
          'Para somar ou subtrair, as dimensões precisam ser iguais. Para multiplicar A × B, as colunas de A precisam coincidir com as linhas de B.',
        )}
        ${criarTabelaRegrasFalhasMatrizes()}
        ${criarTabelaExemplosMatrizes()}
      `,
    ),
  }
}

function obterConteudoAjudaMatrizes(contexto) {
  const secoes = criarConteudosAjudaMatrizes(criarTextoDimensoesAtuais())

  return secoes[contexto] || secoes.geral
}

// Cria os inputs numéricos de uma matriz dentro do container informado.
function gerarInputsMatriz(container, nomeMatriz, linhas, colunas) {
  container.innerHTML = ''

  const tabela = document.createElement('table')
  tabela.classList.add('matrix-grid')

  for (let i = 0; i < linhas; i++) {
    const linhaTabela = document.createElement('tr')

    for (let j = 0; j < colunas; j++) {
      const celula = document.createElement('td')
      const input = document.createElement('input')

      input.type = 'number'
      input.value = '0'
      input.dataset.matriz = nomeMatriz
      input.dataset.linha = i
      input.dataset.coluna = j
      input.setAttribute('aria-label', `${nomeMatriz} linha ${i + 1}, coluna ${j + 1}`)

      celula.appendChild(input)
      linhaTabela.appendChild(celula)
    }

    tabela.appendChild(linhaTabela)
  }

  container.appendChild(tabela)
}

function gerarMatrizes(opcoes = {}) {
  const exibirObservacao = opcoes.exibirObservacao !== false
  const linhasA = lerNumeroInteiro(linhasAInput)
  const colunasA = lerNumeroInteiro(colunasAInput)
  const linhasB = lerNumeroInteiro(linhasBInput)
  const colunasB = lerNumeroInteiro(colunasBInput)

  if (!dimensaoValida(linhasA, colunasA) || !dimensaoValida(linhasB, colunasB)) {
    if (exibirObservacao) {
      definirObservacaoDimensoes('As matrizes precisam ter pelo menos 1 linha e 1 coluna.')
      limparMensagemEResultado()
      return
    }

    limparObservacaoDimensoes()
    limparMensagemEResultado()
    return
  }

  gerarInputsMatriz(matrizAContainer, 'A', linhasA, colunasA)
  gerarInputsMatriz(matrizBContainer, 'B', linhasB, colunasB)
  limparMensagemEResultado()

  if (exibirObservacao) {
    atualizarObservacaoDimensoes()
    return
  }

  limparObservacaoDimensoes()
}

// Lê os valores dos inputs e transforma tudo em um array de arrays.
function lerMatriz(container) {
  const linhas = container.querySelectorAll('tr')
  const matriz = []

  for (let i = 0; i < linhas.length; i++) {
    const inputs = linhas[i].querySelectorAll('input')
    const linhaMatriz = []

    for (let j = 0; j < inputs.length; j++) {
      const valor = Number(inputs[j].value)
      linhaMatriz.push(valor)
    }

    matriz.push(linhaMatriz)
  }

  return matriz
}

function somarMatrizes(matrizA, matrizB) {
  const resultado = []

  for (let i = 0; i < matrizA.length; i++) {
    const linhaResultado = []

    for (let j = 0; j < matrizA[i].length; j++) {
      linhaResultado.push(matrizA[i][j] + matrizB[i][j])
    }

    resultado.push(linhaResultado)
  }

  return resultado
}

function subtrairMatrizes(matrizA, matrizB) {
  const resultado = []

  for (let i = 0; i < matrizA.length; i++) {
    const linhaResultado = []

    for (let j = 0; j < matrizA[i].length; j++) {
      linhaResultado.push(matrizA[i][j] - matrizB[i][j])
    }

    resultado.push(linhaResultado)
  }

  return resultado
}

function multiplicarPorEscalar(matriz, escalar) {
  const resultado = []

  for (let i = 0; i < matriz.length; i++) {
    const linhaResultado = []

    for (let j = 0; j < matriz[i].length; j++) {
      linhaResultado.push(escalar * matriz[i][j])
    }

    resultado.push(linhaResultado)
  }

  return resultado
}

function multiplicarMatrizes(matrizA, matrizB) {
  const resultado = []
  const linhasA = matrizA.length
  const colunasA = matrizA[0].length
  const colunasB = matrizB[0].length

  for (let i = 0; i < linhasA; i++) {
    const linhaResultado = []

    for (let j = 0; j < colunasB; j++) {
      let soma = 0

      for (let k = 0; k < colunasA; k++) {
        soma += matrizA[i][k] * matrizB[k][j]
      }

      linhaResultado.push(soma)
    }

    resultado.push(linhaResultado)
  }

  return resultado
}

function limparErroMatriz() {
  mensagemErro.textContent = ''
  atualizarAcaoErroMatrizes('')

  if (!resultadoContainer.children.length) {
    resultadoMatrizesCard.hidden = true
  }
}

function renderizarResultado(matriz) {
  cancelarMensagemTemporaria('erro-matriz', mensagemErro, acoesErroMatrizes)
  limparErroMatriz()
  resultadoContainer.innerHTML = ''
  resultadoMatrizesCard.hidden = false

  const tabela = document.createElement('table')
  tabela.classList.add('matrix-grid', 'resultado-grid')

  for (let i = 0; i < matriz.length; i++) {
    const linhaTabela = document.createElement('tr')

    for (let j = 0; j < matriz[i].length; j++) {
      const celula = document.createElement('td')
      celula.textContent = matriz[i][j]
      linhaTabela.appendChild(celula)
    }

    tabela.appendChild(linhaTabela)
  }

  resultadoContainer.appendChild(tabela)
  mostrarAviso('Operação realizada com sucesso.', 'sucesso')
}

function mostrarErro(mensagem, exibirPopup = true, contextoAjuda = '') {
  cancelarMensagemTemporaria('erro-matriz', mensagemErro, acoesErroMatrizes)
  resultadoContainer.innerHTML = ''
  resultadoMatrizesCard.hidden = false
  mensagemErro.textContent = mensagem || 'Operação impossível'
  atualizarAcaoErroMatrizes(contextoAjuda)
  agendarMensagemTemporaria('erro-matriz', mensagemErro, limparErroMatriz, acoesErroMatrizes)

  if (exibirPopup) {
    mostrarAviso(mensagem, 'erro')
    return
  }

  esconderAviso()
}

function limparMensagemEResultado() {
  cancelarMensagemTemporaria('erro-matriz', mensagemErro, acoesErroMatrizes)
  resultadoContainer.innerHTML = ''
  limparErroMatriz()
}

function possuemMesmasDimensoes(matrizA, matrizB) {
  return matrizA.length === matrizB.length && matrizA[0].length === matrizB[0].length
}

function atualizarObservacaoPorMatrizes(matrizA, matrizB) {
  const linhasA = matrizA.length
  const colunasA = matrizA[0].length
  const linhasB = matrizB.length
  const colunasB = matrizB[0].length
  const observacao = montarObservacaoDimensoes(linhasA, colunasA, linhasB, colunasB)

  definirObservacaoDimensoes(
    observacao,
    dimensoesTemOperacaoIndisponivel(linhasA, colunasA, linhasB, colunasB),
  )
  atualizarAcaoObservacaoMatrizes(
    obterContextoAjudaPorDimensoes(linhasA, colunasA, linhasB, colunasB),
  )
}

function mostrarErroOperacaoIndisponivel(matrizA, matrizB, mensagem, contextoAjuda) {
  atualizarObservacaoPorMatrizes(matrizA, matrizB)
  contextoAjudaMatrizes = contextoAjuda
  mostrarErro(mensagem, true, contextoAjuda)
}

function executarSoma() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)

  if (!possuemMesmasDimensoes(matrizA, matrizB)) {
    mostrarErroOperacaoIndisponivel(
      matrizA,
      matrizB,
      'Ainda não dá para somar essas matrizes. Ajuste a Matriz A e a Matriz B para terem o mesmo número de linhas e colunas.',
      'soma',
    )
    return
  }

  renderizarResultado(somarMatrizes(matrizA, matrizB))
}

function executarSubtracao() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)

  if (!possuemMesmasDimensoes(matrizA, matrizB)) {
    mostrarErroOperacaoIndisponivel(
      matrizA,
      matrizB,
      'Ainda não dá para subtrair essas matrizes. As duas precisam ter exatamente as mesmas dimensões.',
      'subtracao',
    )
    return
  }

  renderizarResultado(subtrairMatrizes(matrizA, matrizB))
}

function executarMultiplicacaoPorEscalar() {
  const matrizA = lerMatriz(matrizAContainer)
  const escalar = Number(escalarInput.value)

  renderizarResultado(multiplicarPorEscalar(matrizA, escalar))
}

function executarMultiplicacaoMatrizes() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)
  const colunasA = matrizA[0].length
  const linhasB = matrizB.length

  if (colunasA !== linhasB) {
    mostrarErroOperacaoIndisponivel(
      matrizA,
      matrizB,
      'Atualmente não é possível multiplicar essas matrizes porque o número de colunas da Matriz A é diferente do número de linhas da Matriz B.',
      'multiplicacao',
    )
    return
  }

  renderizarResultado(multiplicarMatrizes(matrizA, matrizB))
}

function normalizarEspacosProposicao(proposicao) {
  return proposicao.replace(/\s+/g, ' ').trim()
}

function normalizarOperadoresLogicos(proposicao) {
  const textoNormalizado = normalizarEspacosProposicao(proposicao)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[,;]/g, ' ')
    .replace(/<->/g, ' ↔ ')
    .replace(/->/g, ' → ')
    .replace(/&&/g, ' ^ ')
    .replace(/\|\|/g, ' v ')
    .replace(/∧/g, ' ^ ')
    .replace(/∨/g, ' v ')
    .replace(/!/g, ' ~ ')
    .replace(/\bse\s+e\s+somente\s+se\b/gi, ' ↔ ')
    .replace(/\bse\s+somente\s+se\b/gi, ' ↔ ')
    .replace(/\bimplica\b/gi, ' → ')
    .replace(/\bentao\b/gi, ' → ')
    .replace(/\bnegar\b/gi, ' ~ ')
    .replace(/\bnao\b/gi, ' ~ ')
    .replace(/\bnot\b/gi, ' ~ ')
    .replace(/\band\b/gi, ' ^ ')
    .replace(/\be\b/gi, ' ^ ')
    .replace(/\bor\b/gi, ' v ')
    .replace(/\bou\b/gi, ' v ')
    .replace(/\bv\b/gi, ' v ')
    .replace(/\s*([()~^v→↔])\s*/g, ' $1 ')

  const textoComEspacos = normalizarEspacosProposicao(textoNormalizado)

  if (/^se\s+.+\s+→/.test(textoComEspacos)) {
    return textoComEspacos.replace(/^se\s+/, '')
  }

  return textoComEspacos
}

function normalizarProposicao(proposicao) {
  return normalizarEspacosProposicao(normalizarOperadoresLogicos(proposicao)).replace(/~\s+/g, '~')
}

function criarErroSintaxe(mensagem) {
  const erro = new Error(mensagem)
  erro.name = 'ErroSintaxe'

  return erro
}

// Converte o texto digitado em tokens que o parser consegue interpretar.
function tokenizarProposicao(proposicao) {
  const tokens = []
  let indice = 0

  while (indice < proposicao.length) {
    const caractere = proposicao[indice]

    if (/\s/.test(caractere)) {
      indice += 1
      continue
    }

    if ('()~^v→↔'.includes(caractere)) {
      tokens.push({ tipo: 'simbolo', valor: caractere })
      indice += 1
      continue
    }

    if (/[a-zA-Z]/.test(caractere)) {
      let palavra = ''

      while (indice < proposicao.length && /[a-zA-Z]/.test(proposicao[indice])) {
        palavra += proposicao[indice]
        indice += 1
      }

      const palavraNormalizada = palavra.toLowerCase()

      if (palavraNormalizada === 'not') {
        tokens.push({ tipo: 'simbolo', valor: '~' })
        continue
      }

      if (palavraNormalizada === 'and' || palavraNormalizada === 'e') {
        throw criarErroSintaxe('Conectivo inválido. Para E, use ^, ∧, && ou escreva "e".')
      }

      if (palavraNormalizada === 'or' || palavraNormalizada === 'ou') {
        throw criarErroSintaxe('Conectivo inválido. Para OU, use v, ∨, || ou escreva "ou".')
      }

      if (palavraNormalizada.length > 1) {
        throw criarErroSintaxe('Use variáveis com apenas uma letra, como p, q, r ou s.')
      }

      tokens.push({ tipo: 'variavel', valor: palavraNormalizada })
      continue
    }

    if ('&|-<>∧∨'.includes(caractere)) {
      throw criarErroSintaxe(
        'Conectivo incompleto ou inválido. Use ^, v, &&, ||, ->, <->, ∧, ∨, → ou ↔.',
      )
    }

    throw criarErroSintaxe(`Caractere inválido "${caractere}". Use variáveis e conectivos válidos.`)
  }

  return tokens
}

function obterVariaveisProposicao(tokens) {
  const variaveis = []

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].tipo === 'variavel' && !variaveis.includes(tokens[i].valor)) {
      variaveis.push(tokens[i].valor)
    }
  }

  return variaveis.sort()
}

// Parser recursivo com precedência: ~, ^, v, → e ↔.
function criarParser(tokens) {
  let posicao = 0

  function tokenAtual() {
    return tokens[posicao]
  }

  function consumir(valor) {
    if (tokenAtual() && tokenAtual().valor === valor) {
      posicao += 1
      return true
    }

    return false
  }

  function exigir(valor, mensagem) {
    if (!consumir(valor)) {
      throw criarErroSintaxe(mensagem)
    }
  }

  function criarNo(tipo, esquerda, direita) {
    return { tipo, esquerda, direita }
  }

  function analisarBicondicional() {
    let no = analisarCondicional()

    while (consumir('↔')) {
      no = criarNo('bicondicional', no, analisarCondicional())
    }

    return no
  }

  function analisarCondicional() {
    const no = analisarOu()

    if (consumir('→')) {
      return criarNo('condicional', no, analisarCondicional())
    }

    return no
  }

  function analisarOu() {
    let no = analisarE()

    while (consumir('v')) {
      no = criarNo('disjuncao', no, analisarE())
    }

    return no
  }

  function analisarE() {
    let no = analisarNegacao()

    while (consumir('^')) {
      no = criarNo('conjuncao', no, analisarNegacao())
    }

    return no
  }

  function analisarNegacao() {
    if (consumir('~')) {
      return { tipo: 'negacao', valor: analisarNegacao() }
    }

    return analisarPrimario()
  }

  function analisarPrimario() {
    const token = tokenAtual()

    if (!token) {
      throw criarErroSintaxe(
        'A proposição está incompleta. Confira se há uma variável depois do conectivo.',
      )
    }

    if (token.tipo === 'variavel') {
      posicao += 1
      return { tipo: 'variavel', nome: token.valor }
    }

    if (consumir('(')) {
      const no = analisarBicondicional()
      exigir(')', 'Feche os parênteses da proposição.')
      return no
    }

    throw criarErroSintaxe(
      `Erro de sintaxe perto de "${token.valor}". Verifique se há uma variável antes e depois do conectivo.`,
    )
  }

  function analisar() {
    const arvore = analisarBicondicional()

    if (tokenAtual()) {
      const token = tokenAtual()

      if (token.tipo === 'variavel') {
        throw criarErroSintaxe(`Falta um conectivo antes de "${token.valor}". Use ^, v, → ou ↔.`)
      }

      throw criarErroSintaxe(
        `Erro de sintaxe perto de "${token.valor}". Verifique se há uma variável antes e depois do conectivo.`,
      )
    }

    return arvore
  }

  return { analisar }
}

function analisarProposicao(proposicao) {
  const proposicaoNormalizada = normalizarProposicao(proposicao)
  const tokens = tokenizarProposicao(proposicaoNormalizada)
  const variaveis = obterVariaveisProposicao(tokens)

  if (variaveis.length === 0) {
    throw criarErroSintaxe('Digite ao menos uma variável, como p, q, r ou s.')
  }

  if (variaveis.length > 8) {
    throw criarErroSintaxe('Use no máximo 8 variáveis para manter a tabela legível.')
  }

  return {
    arvore: criarParser(tokens).analisar(),
    proposicaoNormalizada,
    variaveis,
  }
}

function avaliarProposicao(no, valores) {
  if (no.tipo === 'variavel') {
    return valores[no.nome]
  }

  if (no.tipo === 'negacao') {
    return !avaliarProposicao(no.valor, valores)
  }

  const esquerda = avaliarProposicao(no.esquerda, valores)
  const direita = avaliarProposicao(no.direita, valores)

  if (no.tipo === 'conjuncao') {
    return esquerda && direita
  }

  if (no.tipo === 'disjuncao') {
    return esquerda || direita
  }

  if (no.tipo === 'condicional') {
    return !esquerda || direita
  }

  return esquerda === direita
}

// Gera as 2^n linhas da tabela, alternando V e F para cada variável.
function gerarCombinacoesValores(variaveis) {
  const combinacoes = []
  const totalLinhas = 2 ** variaveis.length

  for (let linha = 0; linha < totalLinhas; linha++) {
    const valores = {}

    for (let coluna = 0; coluna < variaveis.length; coluna++) {
      const deslocamento = variaveis.length - coluna - 1
      valores[variaveis[coluna]] = ((linha >> deslocamento) & 1) === 0
    }

    combinacoes.push(valores)
  }

  return combinacoes
}

function gerarTabelaVerdade(proposicao) {
  const analise = analisarProposicao(proposicao)
  const combinacoes = gerarCombinacoesValores(analise.variaveis)
  const linhas = []

  for (let i = 0; i < combinacoes.length; i++) {
    linhas.push({
      valores: combinacoes[i],
      resultado: avaliarProposicao(analise.arvore, combinacoes[i]),
    })
  }

  return {
    linhas,
    proposicaoNormalizada: analise.proposicaoNormalizada,
    totalColunas: analise.variaveis.length + 1,
    totalLinhas: linhas.length,
    variaveis: analise.variaveis,
  }
}

function formatarValorLogico(valor) {
  return valor ? 'V' : 'F'
}

function criarCelulaValor(valor) {
  const celula = document.createElement('td')
  celula.textContent = formatarValorLogico(valor)
  celula.classList.add(valor ? 'truth-value-true' : 'truth-value-false')

  return celula
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function criarTabelaDetalhesErroTabela(linhas) {
  const linhasTabela = linhas
    .map(
      (linha) => `
        <tr>
          <td>${linha.item}</td>
          <td>${linha.detalhe}</td>
        </tr>
      `,
    )
    .join('')

  return `
    <div class="matrix-scroll help-table-scroll">
      <table class="help-table truth-error-table">
        <thead>
          <tr>
            <th>Parte</th>
            <th>Explicação</th>
          </tr>
        </thead>
        <tbody>
          ${linhasTabela}
        </tbody>
      </table>
    </div>
  `
}

function obterDetalhesErroTabela(mensagem) {
  if (mensagem.includes('Digite uma proposição')) {
    return {
      causa: 'O campo da proposição está vazio, então não há variáveis nem conectivos para montar a tabela.',
      correcao: 'Digite pelo menos uma variável, como p, ou uma proposição composta, como p ^ q.',
      exemplos: 'p, ~p, p v q, (p ^ q) → r.',
    }
  }

  if (mensagem.includes('Use variáveis com apenas uma letra')) {
    return {
      causa: 'A calculadora trata cada variável como uma única letra. Palavras como hoje, chuva ou verdadeiro são lidas como variáveis longas.',
      correcao: 'Troque cada proposição simples por uma letra, por exemplo p para "chove" e q para "faz frio".',
      exemplos: 'Use p ^ q em vez de chuva e frio.',
    }
  }

  if (mensagem.includes('máximo 8 variáveis')) {
    return {
      causa: 'A tabela cresce em potência de 2. Com mais de 8 variáveis, ela fica grande demais para ler bem na tela.',
      correcao: 'Reduza a expressão para no máximo 8 letras diferentes ou divida a análise em partes menores.',
      exemplos: 'Com 8 variáveis a tabela já possui 256 linhas.',
    }
  }

  if (mensagem.includes('incompleta')) {
    return {
      causa: 'A proposição terminou logo depois de um conectivo ou de uma negação.',
      correcao: 'Complete a expressão colocando uma variável depois do último símbolo.',
      exemplos: 'p ^ q em vez de p ^. Use ~p em vez de apenas ~.',
    }
  }

  if (mensagem.includes('Feche os parênteses')) {
    return {
      causa: 'Existe um parêntese de abertura sem o parêntese de fechamento correspondente.',
      correcao: 'Confira cada "(" e feche o bloco com ")".',
      exemplos: '(p ^ q) → r em vez de (p ^ q → r.',
    }
  }

  if (mensagem.includes('Falta um conectivo')) {
    return {
      causa: 'Duas variáveis ficaram lado a lado sem uma operação lógica entre elas.',
      correcao: 'Coloque um conectivo entre as variáveis: ^ para E, v para OU, → para implica ou ↔ para bicondicional.',
      exemplos: 'p ^ q em vez de p q.',
    }
  }

  if (mensagem.includes('Caractere inválido')) {
    return {
      causa: 'A expressão contém um símbolo que a calculadora não reconhece como variável, parêntese ou conectivo lógico.',
      correcao: 'Use letras para variáveis e conectivos válidos: ~, ^, v, ->, <->, ∧, ∨, → ou ↔.',
      exemplos: '(p ^ q) -> ~r.',
    }
  }

  if (mensagem.includes('Conectivo incompleto') || mensagem.includes('Conectivo inválido')) {
    return {
      causa: 'Algum conectivo foi digitado incompleto ou em uma forma que não fecha uma operação lógica válida.',
      correcao: 'Use os símbolos completos: && ou ^ para E, || ou v para OU, -> para condicional e <-> para bicondicional.',
      exemplos: 'p -> q em vez de p - q. p <-> q em vez de p <> q.',
    }
  }

  if (mensagem.includes('Erro de sintaxe perto')) {
    return {
      causa: 'O parser encontrou um símbolo em uma posição onde esperava uma variável ou uma subproposição.',
      correcao: 'Confira se há variável antes e depois de cada conectivo e se os parênteses estão envolvendo expressões completas.',
      exemplos: '(p ^ q) v r em vez de p ^ v q.',
    }
  }

  if (mensagem.includes('ao menos uma variável')) {
    return {
      causa: 'A expressão tem símbolos, mas nenhuma variável lógica como p, q, r ou s.',
      correcao: 'Inclua pelo menos uma letra para representar a proposição que será avaliada.',
      exemplos: 'p, ~p ou p → q.',
    }
  }

  return {
    causa: 'A proposição não pôde ser interpretada pelas regras sintáticas da Tabela Verdade.',
    correcao: 'Revise variáveis, conectivos e parênteses, deixando cada conectivo com uma proposição antes e outra depois.',
    exemplos: '(p ^ q) → r, ~p v q, p ↔ q.',
  }
}

function criarAjudaErroTabela(mensagem, proposicao) {
  const detalhes = obterDetalhesErroTabela(mensagem)
  const entrada = proposicao ? escaparHtml(proposicao) : 'campo vazio'
  const mensagemSegura = escaparHtml(mensagem)

  return {
    titulo: 'Por que a Tabela Verdade não foi gerada?',
    subtitulo: 'A mensagem abaixo mostra o erro específico encontrado na proposição.',
    conteudo: `
      <section class="help-notes">
        <h3>O que não deu certo</h3>
        <p>${mensagemSegura}</p>
      </section>

      ${criarTabelaDetalhesErroTabela([
        {
          item: 'Entrada',
          detalhe: `<strong>${entrada}</strong>`,
        },
        {
          item: 'Causa',
          detalhe: detalhes.causa,
        },
        {
          item: 'Como corrigir',
          detalhe: detalhes.correcao,
        },
        {
          item: 'Exemplos válidos',
          detalhe: detalhes.exemplos,
        },
      ])}

      <section class="help-notes">
        <h3>Regra geral</h3>
        <p>
          Uma proposição válida alterna variáveis e conectivos. A negação (~) vem antes de uma
          variável ou de um bloco com parênteses, como ~p ou ~(p v q).
        </p>
      </section>
    `,
  }
}

function limparErroTabela() {
  mensagemTabela.textContent = ''
  acoesErroTabela.hidden = true
  ajudaErroTabelaAtual = null

  if (!tabelaVerdadeResultado.children.length && resumoTabela.hidden) {
    resultadoTabelaCard.hidden = true
  }
}

function renderizarTabelaVerdade(tabela) {
  cancelarMensagemTemporaria('erro-tabela', mensagemTabela, acoesErroTabela)
  limparErroTabela()
  tabelaVerdadeResultado.innerHTML = ''
  resultadoTabelaCard.hidden = false
  resumoTabela.hidden = false
  totalLinhasTabela.textContent = tabela.totalLinhas
  totalColunasTabela.textContent = tabela.totalColunas
  variaveisTabela.textContent = tabela.variaveis.join(', ')

  const elementoTabela = document.createElement('table')
  const cabecalho = document.createElement('thead')
  const corpo = document.createElement('tbody')
  const linhaCabecalho = document.createElement('tr')

  elementoTabela.classList.add('truth-table')

  for (let i = 0; i < tabela.variaveis.length; i++) {
    const coluna = document.createElement('th')
    coluna.textContent = tabela.variaveis[i]
    linhaCabecalho.appendChild(coluna)
  }

  const colunaResultado = document.createElement('th')
  colunaResultado.textContent = tabela.proposicaoNormalizada
  linhaCabecalho.appendChild(colunaResultado)
  cabecalho.appendChild(linhaCabecalho)

  for (let i = 0; i < tabela.linhas.length; i++) {
    const linha = document.createElement('tr')

    for (let j = 0; j < tabela.variaveis.length; j++) {
      linha.appendChild(criarCelulaValor(tabela.linhas[i].valores[tabela.variaveis[j]]))
    }

    linha.appendChild(criarCelulaValor(tabela.linhas[i].resultado))
    corpo.appendChild(linha)
  }

  elementoTabela.appendChild(cabecalho)
  elementoTabela.appendChild(corpo)
  tabelaVerdadeResultado.appendChild(elementoTabela)
  mostrarAviso('Tabela verdade gerada com sucesso.', 'sucesso')
}

function mostrarErroTabela(mensagem, proposicao = '') {
  cancelarMensagemTemporaria('erro-tabela', mensagemTabela, acoesErroTabela)
  tabelaVerdadeResultado.innerHTML = ''
  resumoTabela.hidden = true
  resultadoTabelaCard.hidden = false
  mensagemTabela.textContent = mensagem
  ajudaErroTabelaAtual = criarAjudaErroTabela(mensagem, proposicao)
  acoesErroTabela.hidden = false
  agendarMensagemTemporaria('erro-tabela', mensagemTabela, limparErroTabela, acoesErroTabela)
  mostrarAviso('Operação impossível de ser realizada.')
}

function executarTabelaVerdade() {
  const proposicao = proposicaoInput.value.trim()

  if (!proposicao) {
    mostrarErroTabela('Digite uma proposição lógica para gerar a tabela verdade.', proposicao)
    return
  }

  try {
    renderizarTabelaVerdade(gerarTabelaVerdade(proposicao))
  } catch (erro) {
    mostrarErroTabela(erro.message || 'Não foi possível interpretar a proposição.', proposicao)
  }
}

function limparTabelaVerdade() {
  proposicaoInput.value = ''
  cancelarMensagemTemporaria('erro-tabela', mensagemTabela, acoesErroTabela)
  tabelaVerdadeResultado.innerHTML = ''
  resumoTabela.hidden = true
  limparErroTabela()
  esconderAviso()
}

function renderizarAjudaMatrizes(contexto) {
  const ajuda = obterConteudoAjudaMatrizes(contexto)

  ajudaMatrizesTitulo.textContent = ajuda.titulo
  ajudaMatrizesSubtitulo.textContent = ajuda.subtitulo
  ajudaMatrizesConteudo.innerHTML = ajuda.conteudo
}

function abrirModal(modal, botaoFoco) {
  clearTimeout(modalTimers[modal.id])
  modal.classList.remove('fechando')
  modal.hidden = false
  botaoFoco.focus()
}

function fecharModal(modal) {
  clearTimeout(modalTimers[modal.id])

  if (modal.hidden) {
    return
  }

  modal.classList.add('fechando')

  modalTimers[modal.id] = setTimeout(() => {
    modal.hidden = true
    modal.classList.remove('fechando')
  }, 160)
}

function fecharModalAoClicarFora(evento, modal, fechar) {
  if (evento.target === modal) {
    fechar()
  }
}

function abrirAjudaMatrizes(contexto = 'geral') {
  contextoAjudaMatrizes = contexto || 'geral'
  renderizarAjudaMatrizes(contextoAjudaMatrizes)
  abrirModal(ajudaMatrizesModal, fecharAjudaMatrizesButton)
}

function fecharAjudaMatrizes() {
  fecharModal(ajudaMatrizesModal)
}

function renderizarAjudaTabelaGeral() {
  ajudaTabelaTitulo.textContent = ajudaTabelaPadrao.titulo
  ajudaTabelaSubtitulo.textContent = ajudaTabelaPadrao.subtitulo
  ajudaTabelaConteudo.innerHTML = ajudaTabelaPadrao.conteudo
}

function renderizarAjudaTabelaErro() {
  const ajuda = ajudaErroTabelaAtual || criarAjudaErroTabela(
    'Não foi possível interpretar a proposição.',
    proposicaoInput.value.trim(),
  )

  ajudaTabelaTitulo.textContent = ajuda.titulo
  ajudaTabelaSubtitulo.textContent = ajuda.subtitulo
  ajudaTabelaConteudo.innerHTML = ajuda.conteudo
}

function abrirAjudaTabela(contexto = 'geral') {
  if (contexto === 'erro') {
    renderizarAjudaTabelaErro()
  } else {
    renderizarAjudaTabelaGeral()
  }

  abrirModal(ajudaModal, fecharAjudaButton)
}

function fecharAjudaTabela() {
  fecharModal(ajudaModal)
}

function limpar() {
  const inputsMatrizes = selecionarTodos('#matriz-a input, #matriz-b input')

  for (let i = 0; i < inputsMatrizes.length; i++) {
    inputsMatrizes[i].value = '0'
  }

  escalarInput.value = '1'
  limparMensagemEResultado()
}

carregarIdentidadeVisual()
aplicarTema(obterTemaInicial())

window.addEventListener('hashchange', atualizarNavegacao)
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 821px)').matches) {
    fecharMenuMobile()
  }
})
document.addEventListener('click', fecharMenuAoClicarFora)
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    fecharMenuMobile()
    fecharAjudaMatrizes()
    fecharAjudaTabela()
  }
})
menuToggleButton.addEventListener('click', alternarMenuMobile)
for (let i = 0; i < linksPagina.length; i++) {
  linksPagina[i].addEventListener('click', fecharMenuMobile)
}
temaEscuroInput.addEventListener('change', alternarTema)
gerarMatrizesButton.addEventListener('click', gerarMatrizes)
somarButton.addEventListener('click', executarSoma)
subtrairButton.addEventListener('click', executarSubtracao)
multiplicarEscalarButton.addEventListener('click', executarMultiplicacaoPorEscalar)
multiplicarMatrizesButton.addEventListener('click', executarMultiplicacaoMatrizes)
limparButton.addEventListener('click', limpar)
ajudaMatrizesButton.addEventListener('click', () => abrirAjudaMatrizes('geral'))
saberMaisObservacaoMatrizesButton.addEventListener('click', () => {
  abrirAjudaMatrizes(saberMaisObservacaoMatrizesButton.dataset.contextoAjuda || 'regras')
})
saberMaisErroMatrizesButton.addEventListener('click', () => {
  abrirAjudaMatrizes(saberMaisErroMatrizesButton.dataset.contextoAjuda || contextoAjudaMatrizes)
})
fecharAjudaMatrizesButton.addEventListener('click', fecharAjudaMatrizes)
ajudaMatrizesModal.addEventListener('click', (evento) => {
  fecharModalAoClicarFora(evento, ajudaMatrizesModal, fecharAjudaMatrizes)
})
gerarTabelaButton.addEventListener('click', executarTabelaVerdade)
limparTabelaButton.addEventListener('click', limparTabelaVerdade)
ajudaTabelaButton.addEventListener('click', abrirAjudaTabela)
saberMaisErroTabelaButton.addEventListener('click', () => abrirAjudaTabela('erro'))
fecharAjudaButton.addEventListener('click', fecharAjudaTabela)
ajudaModal.addEventListener('click', (evento) => {
  fecharModalAoClicarFora(evento, ajudaModal, fecharAjudaTabela)
})

proposicaoInput.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    executarTabelaVerdade()
  }
})

gerarMatrizes({ exibirObservacao: false })
atualizarNavegacao()
