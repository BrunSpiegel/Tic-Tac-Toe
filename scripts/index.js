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

const moveSenery = []

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

const addMoveSenery = () => {
  const scenery =  getSenery()

 moveSenery.push(scenery)
}

const printBoardByScenery = (scenery) => {
  for (let index = 0; index < scenery.length; index++) {
    $boardList[index].textContent = scenery[index]
  }
}

const printMoveList = (move, playerName, boardIndex) => {
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

  const $historyMoveItems = document.querySelectorAll('.history-moves')

  for(let index = 0; index < $historyMoveItems.length; index++) {
    const $moveItem = $historyMoveItems[index]

    $moveItem.addEventListener('click', function() {
      const currentScenery = moveSenery[index]

      printBoardByScenery(currentScenery)
    })
  }
}

const toggleMove = () => {
  currentMove = currentMove === 'X' ? 'O' : 'X'
}

const printWinnerName = (winnerName) => {
  $winnerName.textContent = winnerName
}

const getSenery = () => {
  const scenery = Array.from($boardList).map(($board) => {
    const move = $board.textContent

    return move
  })

  return scenery
}

const verifyBestOf = (winner) => {
  if (scorePlayer1 === 2 && bestOf === 3) {
    return $winnerName.textContent = `${winner} Venceu!!` 
  }

  if (scorePlayer1 === 3 && bestOf === 5) {
    return `${winner} Venceu!!`
  }

  if (scorePlayer2 === 2 && bestOf === 3) {
    return `${winner} Venceu!!`
  }

  if (scorePlayer1 === 3 && bestOf === 5) {
    return `${winner} Venceu!!`
  }
}

const printMatchHistory = (winner, scenery) => {
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

const verifyGame = () => {
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

  $boardList.forEach(($field) => {
    if ($field.innerHTML != '') filledFields++
  })

  if (filledFields === 9) return 'draw'
}

const resetGetSenery = () => {
  $matchHistoryList.textContent = ""
}

const resetWinnerName = () => {
  $winnerName.textContent = ''
}

const resetHistoryList = () => {
  $historyMoveList.innerHTML = ''
}

const resetScoreboard = () => {
  $score1.textContent = '00'
  $score2.textContent = '00'
}

const resetBattlefield = () => {
  $boardList.forEach(($boardItem) => {
    $boardItem.innerHTML = ''
  })
}

const toggleBestOf = () => {
  bestOf = bestOf === 3 ? 5 : 3
}

const bot = () => {
  const randomNumber = Math.random() * 9
  const index = Math.floor(randomNumber)
  const $boardItem = $boardList[index]

  const game = verifyGame()

  if ($boardItem.textContent != '' && game != 'draw') return bot()

  move(index, 'bot')
}

const move = (boardIndex, type) => {
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
      setTimeout(() => {
        gameStart = true
        if (botActive)
          currentMove = 'X'
      }, 1000)
    }

    if (gameResult === 'draw') {
      gameStart = false
      setTimeout(resetBattlefield, 1000)
      setTimeout(resetHistoryList, 1000)
      printMatchHistory('Empate', scenery)
      setTimeout(() => {
        gameStart = true
        if (botActive)
          currentMove = 'X'
      }, 1000)
    }

    const bestOfResult = verifyBestOf(playerName)

    printMoveList(currentMove, playerName, boardIndex)
    toggleMove()
    addMoveSenery()
    if (type === 'user' && botActive) bot()
    if (bestOfResult !== undefined) {
      resetScoreboard()
      scorePlayer1 = 0
      scorePlayer2 = 0
      bestOfResult 
    }
  }
}

const addPoint = (winner) => {
  if (winner === 'X') scorePlayer1++
  if (winner === 'O') scorePlayer2++
}

const printScore = () => {
  $score1.innerHTML = scorePlayer1 < 10 ? '0' + scorePlayer1 : scorePlayer1
  $score2.innerHTML = scorePlayer2 < 10 ? '0' + scorePlayer2 : scorePlayer2
}

const addEventListener = () => {
  for (let index = 0; index < $boardList.length; index++) {
    const $boardItem = $boardList[index]

    $boardItem.addEventListener('click', () => {
      move(index, 'user')
    })
  }
}

addEventListener()

$switcherBOT.addEventListener('click', () => {
  $switcherBOT.classList.toggle('active')
  botActive = !botActive
  $playerField2.value = botActive ? 'BOT' : ''
  $playerField2.disabled = !$playerField2.disabled
})

$switcherBestOf.addEventListener('click', () => {
  $switcherBestOf.classList.toggle('active')
  toggleBestOf()
})

$startButton.addEventListener('click', () => {
  $startButton.classList.toggle('start-active')

  gameButtonStart = gameButtonStart === false ? true : false

})

$restartButton.addEventListener('click', () => {
  resetHistoryList()
  resetScoreboard()
  resetBattlefield()
  resetWinnerName()
  resetGetSenery()
})
