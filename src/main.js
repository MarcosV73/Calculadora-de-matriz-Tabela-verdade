import './style.css'

const linhasAInput = document.querySelector('#linhas-a')
const colunasAInput = document.querySelector('#colunas-a')
const linhasBInput = document.querySelector('#linhas-b')
const colunasBInput = document.querySelector('#colunas-b')
const escalarInput = document.querySelector('#escalar')

const matrizAContainer = document.querySelector('#matriz-a')
const matrizBContainer = document.querySelector('#matriz-b')
const resultadoContainer = document.querySelector('#resultado')
const mensagemErro = document.querySelector('#mensagem-erro')
const aviso = document.querySelector('#aviso')

const gerarMatrizesButton = document.querySelector('#gerar-matrizes')
const somarButton = document.querySelector('#somar')
const subtrairButton = document.querySelector('#subtrair')
const multiplicarEscalarButton = document.querySelector('#multiplicar-escalar')
const multiplicarMatrizesButton = document.querySelector('#multiplicar-matrizes')
const limparButton = document.querySelector('#limpar')
const dimensaoInputs = [linhasAInput, colunasAInput, linhasBInput, colunasBInput]

let avisoTimer = null
let avisoSaidaTimer = null
let audioContext = null

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
  }, 3000)
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

function montarAvisoDimensoes(linhasA, colunasA, linhasB, colunasB) {
  const somaSubtracaoImpossivel = linhasA !== linhasB || colunasA !== colunasB
  const multiplicacaoImpossivel = colunasA !== linhasB

  if (somaSubtracaoImpossivel && multiplicacaoImpossivel) {
    return 'Com essas dimensões, não é possível somar, subtrair nem multiplicar as matrizes entre si.'
  }

  if (somaSubtracaoImpossivel) {
    return 'Com essas dimensões, não é possível somar nem subtrair as matrizes.'
  }

  if (multiplicacaoImpossivel) {
    return 'Com essas dimensões, não é possível multiplicar as matrizes entre si.'
  }

  return ''
}

function avisarSeDimensoesForemImpossiveis() {
  const linhasA = lerNumeroInteiro(linhasAInput)
  const colunasA = lerNumeroInteiro(colunasAInput)
  const linhasB = lerNumeroInteiro(linhasBInput)
  const colunasB = lerNumeroInteiro(colunasBInput)

  if (!dimensaoValida(linhasA, colunasA) || !dimensaoValida(linhasB, colunasB)) {
    mostrarAviso('As matrizes precisam ter pelo menos 1 linha e 1 coluna.')
    return
  }

  const avisoDimensoes = montarAvisoDimensoes(linhasA, colunasA, linhasB, colunasB)

  if (avisoDimensoes) {
    mostrarAviso(avisoDimensoes)
    return
  }

  esconderAviso()
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

function gerarMatrizes() {
  const linhasA = lerNumeroInteiro(linhasAInput)
  const colunasA = lerNumeroInteiro(colunasAInput)
  const linhasB = lerNumeroInteiro(linhasBInput)
  const colunasB = lerNumeroInteiro(colunasBInput)

  if (!dimensaoValida(linhasA, colunasA) || !dimensaoValida(linhasB, colunasB)) {
    mostrarErro('As matrizes precisam ter pelo menos 1 linha e 1 coluna.')
    return
  }

  gerarInputsMatriz(matrizAContainer, 'A', linhasA, colunasA)
  gerarInputsMatriz(matrizBContainer, 'B', linhasB, colunasB)
  limparMensagemEResultado()
  avisarSeDimensoesForemImpossiveis()
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

function renderizarResultado(matriz) {
  mensagemErro.textContent = ''
  resultadoContainer.innerHTML = ''

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

function mostrarErro(mensagem) {
  resultadoContainer.innerHTML = ''
  mensagemErro.textContent = 'Opera\u00e7\u00e3o imposs\u00edvel'
  mostrarAviso(mensagem, 'erro')
}

function limparMensagemEResultado() {
  mensagemErro.textContent = ''
  resultadoContainer.innerHTML = ''
}

function possuemMesmasDimensoes(matrizA, matrizB) {
  return matrizA.length === matrizB.length && matrizA[0].length === matrizB[0].length
}

function executarSoma() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)

  if (!possuemMesmasDimensoes(matrizA, matrizB)) {
    mostrarErro('Não é possível somar: a Matriz A e a Matriz B precisam ter as mesmas dimensões.')
    return
  }

  renderizarResultado(somarMatrizes(matrizA, matrizB))
}

function executarSubtracao() {
  const matrizA = lerMatriz(matrizAContainer)
  const matrizB = lerMatriz(matrizBContainer)

  if (!possuemMesmasDimensoes(matrizA, matrizB)) {
    mostrarErro('Não é possível subtrair: a Matriz A e a Matriz B precisam ter as mesmas dimensões.')
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
    mostrarErro('Não é possível multiplicar: o número de colunas da Matriz A precisa ser igual ao número de linhas da Matriz B.')
    return
  }

  renderizarResultado(multiplicarMatrizes(matrizA, matrizB))
}

function limpar() {
  const inputsMatrizes = document.querySelectorAll('#matriz-a input, #matriz-b input')

  for (let i = 0; i < inputsMatrizes.length; i++) {
    inputsMatrizes[i].value = '0'
  }

  escalarInput.value = '1'
  limparMensagemEResultado()
}

gerarMatrizesButton.addEventListener('click', gerarMatrizes)
somarButton.addEventListener('click', executarSoma)
subtrairButton.addEventListener('click', executarSubtracao)
multiplicarEscalarButton.addEventListener('click', executarMultiplicacaoPorEscalar)
multiplicarMatrizesButton.addEventListener('click', executarMultiplicacaoMatrizes)
limparButton.addEventListener('click', limpar)

for (let i = 0; i < dimensaoInputs.length; i++) {
  dimensaoInputs[i].addEventListener('change', avisarSeDimensoesForemImpossiveis)
}

gerarMatrizes()
