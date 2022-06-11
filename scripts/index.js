const $boardList = document.querySelectorAll('.board-item')
const $score1 = document.querySelector('.score-player-1')
const $score2 = document.querySelector('.score-player-2')
const $winnerName = document.querySelector('.title-winner')
const $playerField1 = document.querySelector('.input-player-1')
const $playerField2 = document.querySelector('.input-player-2')
const $historyMoveList = document.querySelector('.history-move-box')
const $matchHistoryList = document.querySelector('.match-history-list')
const $switcherBOT = document.querySelector('.switcher-bot')
const $switcherBestOf = document.querySelector('.switcher-MD')
const $startButton = document.querySelector('.start')
const $restartButton = document.querySelector('.restart')

let = currentMove = 'X'
let scorePlayer1 = 0
let scorePlayer2 = 0
let gameStart = true
let gameButtonStart = false
let botActive = false
let bestOf = 3

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function printMoveList(move, playerName, boardIndex) {
  const dictionaryIndexBoard = [
    'Primeiro',
    'Segundo',
    'Terceiro',
    'Quarto',
    'Quinto',
    'Sexto',
    'Sétimo',
    'Oitavo',
    'Nono',
  ]

  $historyMoveList.innerHTML += `
  <div class="history-moves">
    <span class="moves-letter">${move}</span>
    <div>
      <h2 class="moves-player">${playerName}</h2>
      <p class="moves-paragraph">${dictionaryIndexBoard[boardIndex]} Campo</p>
    </div>
  </div>`
}

function toggleMove() {
  currentMove = currentMove === 'X' ? 'O' : 'X'
}

function printWinnerName(winnerName) {
  $winnerName.textContent = winnerName
}

function getSenery() {
  const scenery = []

  for (const $board of $boardList) {
    const move = $board.textContent
    scenery.push(move)
  }

  return scenery
}

function verifyBestOf() {
  if (scorePlayer1 === 2 && bestOf === 3) {
    return 'X'
  }

  if (scorePlayer1 === 3 && bestOf === 5) {
    return 'X'
  }

  if (scorePlayer2 === 2 && bestOf === 3) {
    return 'O'
  }

  if (scorePlayer1 === 3 && bestOf === 5) {
    return 'O'
  }
}

function printMatchHistory(winner, scenery) {
  let miniBoardScenery = ''

  for (const move of scenery) {
    miniBoardScenery += `<span class="small-squares">${move}</span>`
  }

  $matchHistoryList.innerHTML += `
  <div class="wrap-history-play">
    <div class="winner-box">
      <span class="winner-span">Vencedor</span>
      <p class="display-winner">${winner}</p>
    </div>
    <span class="cenary-text">Cenário</span>
    <div class="wrapper-small-squares">
      ${miniBoardScenery}
    </div>
  </div>`
}

function verifyGame() {
  let filledFields = 0

  for (const condition of winConditions) {
    const fieldIndex0 = condition[0]
    const fieldIndex1 = condition[1]
    const fieldIndex2 = condition[2]

    const $field1 = $boardList[fieldIndex0]
    const $field2 = $boardList[fieldIndex1]
    const $field3 = $boardList[fieldIndex2]

    if ($field1.innerHTML != '' && $field1.innerHTML === $field2.innerHTML && $field2.innerHTML === $field3.innerHTML) {
      return currentMove
    }
  }

  for (const $field of $boardList) {
    if ($field.innerHTML != '') filledFields++

    if (filledFields === 9) return 'draw'
  }
}

function resetNamePlayer() {
  $playerField1.value = ''
  $playerField2.value = ''
}

function reserWinnerName() {
  $winnerName.textContent = ''
}

function resetHistoryList() {
  $historyMoveList.innerHTML = ''
}

function resetScoreboard() {
  $score1.textContent = '00'
  $score2.textContent = '00'
}

function resetBattlefield() {
  for (const $boardItem of $boardList) {
    $boardItem.innerHTML = ''
  }
}

function toggleBestOf() {
  bestOf = bestOf === 3 ? 5 : 3
}

function bot() {
  const randomNumber = Math.random() * 9
  const index = Math.floor(randomNumber)
  const $boardItem = $boardList[index]

  const game = verifyGame()

  if ($boardItem.textContent != '' && game != 'draw') return bot()

  move(index, 'bot')
}

function move(boardIndex, type) {
  if (gameButtonStart === true) {
    const $boardItem = $boardList[boardIndex]

    if (!gameStart) return

    if ($boardItem.innerHTML != '') return

    $boardItem.innerHTML = currentMove

    const gameResult = verifyGame()

    const scenery = getSenery()

    const playerName = currentMove === 'X' ? $playerField1.value : $playerField2.value

    if (gameResult === 'X' || gameResult === 'O') {
      gameStart = false
      addPoint(gameResult)
      printScore()
      printWinnerName(playerName)
      setTimeout(resetBattlefield, 1000)
      setTimeout(resetHistoryList, 1000)
      printMatchHistory(playerName, scenery)
      setTimeout(function () {
        gameStart = true
        if (botActive) currentMove = 'X'
      }, 1000)
    }

    if (gameResult === 'draw') {
      gameStart = false
      setTimeout(resetBattlefield, 1000)
      setTimeout(resetHistoryList, 1000)
      printMatchHistory('Empate', scenery)
      setTimeout(function () {
        gameStart = true
        if (botActive) currentMove = 'X'
      }, 1000)
    }

    const bestOfResult = verifyBestOf()

    printMoveList(currentMove, playerName, boardIndex)
    toggleMove()
    if (type === 'user' && botActive) bot()
    if (bestOfResult !== undefined) {
      resetScoreboard()
      scorePlayer1 = 0
      scorePlayer2 = 0
      alert(bestOfResult)
    }
  }
}

function addPoint(winner) {
  if (winner === 'X') scorePlayer1++
  if (winner === 'O') scorePlayer2++
}

function printScore() {
  $score1.innerHTML = scorePlayer1 < 10 ? '0' + scorePlayer1 : scorePlayer1
  $score2.innerHTML = scorePlayer2 < 10 ? '0' + scorePlayer2 : scorePlayer2
}

function addEventListener() {
  for (let index = 0; index < $boardList.length; index++) {
    const $boardItem = $boardList[index]

    $boardItem.addEventListener('click', function () {
      move(index, 'user')
    })
  }
}

addEventListener()

$switcherBOT.addEventListener('click', function () {
  $switcherBOT.classList.toggle('active')
  botActive = !botActive
  $playerField2.value = botActive ? 'BOT' : ''
  $playerField2.disabled = !$playerField2.disabled
})

$switcherBestOf.addEventListener('click', function () {
  $switcherBestOf.classList.toggle('active')
  toggleBestOf()
})

$startButton.addEventListener('click', function () {
  $startButton.classList.toggle('active')

  if (gameButtonStart === false) {
    gameButtonStart = true 
  } else {
    gameButtonStart = false
  }
})

$restartButton.addEventListener('click', function () {
  resetHistoryList()
  resetScoreboard()
  resetBattlefield()
  resetNamePlayer()
  reserWinnerName()
  window.location.reload()
})
