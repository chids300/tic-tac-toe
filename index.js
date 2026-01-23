let WIN_COUNT = 3
let NUM_COLS = 3

let BOARD_SIZE = NUM_COLS ** 2
const BOARD = []

let NUM_ROUNDS = 1
const ROUND_WINS = []
let CURRENT_ROUND = 1
let TURN_COUNT = 0

let P1_TURN = true
let GAME_OVER = false

const P1Win = 0
const P2Win = 1
const Draw = 2

class Game {
    
}

// to check if any moves have been made, i do this so
let itemPlayed = false;

const board = document.querySelector("#board")
const statusText = document.querySelector("#status-text")
const restartBtn = document.querySelector("#restart-btn")
const roundSelection = document.querySelector("#round-select")
const roundStatus = document.querySelector("#round-status")
const roundScores = document.querySelector("#round-scores")


roundSelection.addEventListener('change', function () {
    if(itemPlayed) {
        alert("restart game before changing round amount")
        return
    }

    NUM_ROUNDS = Number(this.value)
    console.log(NUM_ROUNDS)

    if(NUM_ROUNDS >= 2) {
        roundStatus.style.display = "block"
        roundStatus.textContent = `round ${CURRENT_ROUND}/${NUM_ROUNDS}`
    }
    else{
        roundStatus.style.display = "none"
    }

})

// formula for mapping 1D coords to 2D coords and mapping it back
// i = X + Y * numCols
// Y = index / numCols
// X = index - (Y * width)



newGame(BOARD_SIZE)


function newGame(board_size) {
    setStatusText("Player 1s turn")

    roundStatus.style.display = "none"
    ROUND_WINS.length = 0

    CURRENT_ROUND = 1
    NUM_ROUNDS = 1
    P1_TURN = true
    TURN_COUNT = 0
    GAME_OVER = false
    itemPlayed = false

    initBoard(BOARD_SIZE)
}


function initBoard(board_size) {
    board.innerHTML = ""
    BOARD.length= 0

    for(let divIndex=0; divIndex<board_size; divIndex++){
        var div = document.createElement('div')
        div.classList.add("boardItem")
        div.textContent = ""


        board.appendChild(div)
        BOARD.push(div)

        div.addEventListener("click", async function() {
            itemPlayed = true

            if(!GAME_OVER){

                // first check if square has already been clicked
                if(['X', 'O'].includes(this.textContent)) return

                // dont process new moves whilst calculating winner
                GAME_OVER = true

                // boolean to decide if it was player 1 or 2's turn
                const symbol = P1_TURN ? 'X' : 'O'

                // increment the turn counter for easy draw detection logic (check if TURN_COUNT === size of board)
                TURN_COUNT += 1 

                // set the text in the div
                this.textContent = symbol

                // functions in js are able to capture the value of variables from surrounding scope if they are referenced inside the function (closure)

                // this allows us to use the event handler to hold the i variable from the loop and we can use this to get the x,y position of the item on the board
                const Y = Math.floor(divIndex / NUM_COLS)
                const X = divIndex - (Y * NUM_COLS)

                // x, y pos makes checking win conditions easy
                const winningRows = checkForWinner(divIndex, WIN_COUNT)


                // winningRows is null if there is no winner
                if(winningRows != null){

                    // set the winning text
                    setStatusText(`${P1_TURN ? "Player 1" : "Player 2"} wins ${NUM_ROUNDS > 1 ? `Round ${CURRENT_ROUND}` : ""}`)

                    // push the round winner to the array
                    ROUND_WINS.push(P1_TURN ? P1Win : P2Win)

                    // first check if we still have more rounds to play
                    if(NUM_ROUNDS > 1 && CURRENT_ROUND < NUM_ROUNDS){

                        await flashWinningItems(winningRows)
                        nextRound()

                    }

                    // check if we are at the end of a round
                    else if(CURRENT_ROUND == NUM_ROUNDS){

                        await flashWinningItems(winningRows)

                        if(NUM_ROUNDS > 1){
                            updateRoundScores()
                            calculateRoundWinner()
                        }

                        GAME_OVER = true
                    }
                }

                // check if there is still more space on the board to play
                else if(winningRows == null && TURN_COUNT < BOARD.length){

                    GAME_OVER = false
                    P1_TURN = !P1_TURN

                    setStatusText(`${P1_TURN ? "Player 1's" : "Player 2's"} turn`)
                }

                // check if there is no winner, no space left to play on board but there is still more rounds
                else if(winningRows == null 
                    && TURN_COUNT == BOARD.length
                    && CURRENT_ROUND < NUM_ROUNDS) {

                    setStatusText("A draw has occured")

                    ROUND_WINS.push(Draw)
                    await flashAllItems()
                    nextRound()
                }
                
                // 
                else if(winningRows == null
                    && TURN_COUNT == BOARD.length
                    && CURRENT_ROUND == NUM_ROUNDS) {

                    setStatusText("A draw has occured")

                    ROUND_WINS.push(Draw)
                    updateRoundScores()

                    await flashAllItems()
                    GAME_OVER = true

                }
            }
        })
    }
}


async function flashAllItems() {
    const indexes = []
                    
    for(let i=0; i<BOARD.length; i++){
        indexes.push(i)
    }

    await flashWinningItems(indexes)
}

async function flashWinningItems(items){
    const flashInterval = setInterval(() => flashBoardItem(items), 100)

    return new Promise((resolve) => {
        setTimeout(() => {
            clearInterval(flashInterval)
            resolve()
        }, 2000)
    })
}

const flashBoardItem = (boardIdx) => {
    boardIdx.forEach(i => {
        const item = BOARD[i]

        if(item.classList.contains("flashColor")){
            item.classList.remove("flashColor")
        }
        else {
            item.classList.add("flashColor")
        }
    })
}

function setStatusText(text){
    statusText.textContent = text
}

function updateRoundStatusText(text) {
    roundStatus.style.display = "block"
    roundStatus.textContent = text
}

function updateRoundScores() {
    roundScores.innerHTML = ""
    roundScores.style.display = "flex"

    const scoresHeader = document.createElement("h2")
    scoresHeader.textContent = "Round Winners:"
    roundScores.appendChild(scoresHeader)
    
    ROUND_WINS.forEach((roundStatus, index) => {
        let status;

        if(roundStatus == P1Win){
            status = "Player 1"
        }
        else if(roundStatus == P2Win) {
            status = "Player 2"
        }
        else {
            status = "Draw"
        }

        
        const roundNum = index + 1
        const text = `Round ${roundNum}: ${status}`

        const p = document.createElement("p")
        p.textContent = text
        roundScores.appendChild(p)
    })
}


function calculateRoundWinner() {
    // calculates the number of wins and draws and does respective comparisons
    const p1WinCount = ROUND_WINS
        .reduce((previous, roundWinner) => {
            if(roundWinner == P1Win){
                return previous + 1
            }

            return previous

        }, 0)

    const p2WinCount = ROUND_WINS
        .reduce((previous, roundWinner) => {
            if(roundWinner == P2Win){
                return previous + 1
            }

            return previous
        }, 0)

    const drawCount = ROUND_WINS
        .reduce((previous, roundWinner) => {
            if(roundWinner == Draw){
                return previous + 1
            }

            return previous
        }, 0)

    if(p1WinCount > p2WinCount && p1WinCount > drawCount){
        statusText.textContent = "Player 1 is the champion"   
    }
    else if(p2WinCount > p1WinCount && p2WinCount > drawCount){
        statusText.textContent = "Player 2 is the champion"
    }
    else if(drawCount > p1WinCount && drawCount > p2WinCount){
        statusText.textContent = "You are both losers"
    }
    else if(p1WinCount === p2WinCount){
        statusText.textContent = "You are both losers"
    }
}

function nextRound() {
    GAME_OVER = false
    CURRENT_ROUND += 1
    TURN_COUNT = 0

    updateRoundStatusText(`Round ${CURRENT_ROUND}/${NUM_ROUNDS}`)
    updateRoundScores()

    initBoard(BOARD_SIZE)
}




// for rows it looks at the cells to the left and right of the clicked cell

// for columns it looks at the cells to the top and bottom

// for diagonals it looks at cells (x +- 1), (y +- 1) to get the top right, top left, bottom right and bottom left colums


function checkForWinner(index, WIN_COUNT) {

    // each function returns an array of indexes which contains the winning row/column/diagonal

    const rows = checkRows(index, WIN_COUNT)
    const columns = checkColumns(index, WIN_COUNT)
    const diagonal = checkDiags(index, WIN_COUNT)

    // check if these are equal to the win count

    if(rows.length == WIN_COUNT) {
        return rows

    } else if(columns.length == WIN_COUNT) {
        return columns
    }
    else if(diagonal.length == WIN_COUNT) {
        return diagonal
    }

    // return null if no winning row/col/diag found

    return null
}


function checkRows(startIdx, winAmount) {
    // want to check on the left and right side of the index
    // start with left side

    const y = Math.floor(startIdx / NUM_COLS)
    const x = startIdx - (y * NUM_COLS)

    const winningIdx = []

    // converts x,y coord to index to get starting position
    //const startIdx = x + y * NUM_COLS;

    winningIdx.push(startIdx)

    let leftCount = 0

    let leftX = x - 1
    let leftIdx = leftX + y * NUM_COLS;

    while(leftX >=0 && BOARD[leftIdx].textContent === BOARD[startIdx].textContent && leftCount < winAmount){
        leftCount++ 
        leftX -= 1
        winningIdx.push(leftIdx)

        leftIdx = leftX + y * NUM_COLS
    }

    if(winningIdx.length == winAmount){
        return winningIdx
    }

    let rightCount = 0
    let rightX = x + 1
    let rightIdx = rightX + y * NUM_COLS

    while(rightX < NUM_COLS && BOARD[rightIdx].textContent === BOARD[startIdx].textContent && rightCount < winAmount){
        rightCount++
        rightX++

        winningIdx.push(rightIdx)
        rightIdx = rightX + y * NUM_COLS
    }

    return winningIdx
}


function checkColumns(startIdx, winAmount) {

    const y = Math.floor(startIdx / NUM_COLS)
    const x = startIdx - (y * NUM_COLS)

    const winningIdx = []
    winningIdx.push(startIdx)

    // first check above the starting position

    let topY = y - 1
    let newIdx = x + topY * NUM_COLS
    let topCount = 0

    while(topY >= 0 && BOARD[newIdx].textContent === BOARD[startIdx].textContent && topCount < winAmount){
        topCount += 1

        topY -= 1
        winningIdx.push(newIdx)
        newIdx = x + topY * NUM_COLS
    }

    if(winningIdx.length === winAmount) {
        return winningIdx
    }

    // then check below the starting position

    let bottomY = y + 1
    let bottomCount = 0

    newIdx = x + bottomY * NUM_COLS

    while(bottomY < NUM_COLS && BOARD[newIdx].textContent === BOARD[startIdx].textContent && bottomCount < winAmount){
        bottomCount += 1
        bottomY += 1


        winningIdx.push(newIdx)
        newIdx = x + bottomY * NUM_COLS
    }

    return winningIdx
}

function checkDiags(startIdx, winAmount) {

    const y = Math.floor(startIdx / NUM_COLS)
    const x = startIdx - (y * NUM_COLS)

    const winningIdx = []
    winningIdx.push(startIdx)

    // for diagonal goin from top left to bottom right

    let topLeftX = x - 1
    let topLeftY = y - 1

    let newIdx = topLeftX + topLeftY * NUM_COLS
    
    let topLeftCount = 0

    while(topLeftX >= 0 && topLeftY>=0 && BOARD[newIdx].textContent === BOARD[startIdx].textContent && topLeftCount < winAmount){
        topLeftCount += 1
        topLeftX -= 1
        topLeftY -= 1

        winningIdx.push(newIdx)
        newIdx = topLeftX + topLeftY * NUM_COLS
    }

    if(winningIdx.length == winAmount) {
        return winningIdx
    }

    let bottomRightX = x + 1
    let bottomRightY = y + 1

    newIdx = bottomRightX + bottomRightY * NUM_COLS

    let bottomRightCount = 0

    while(bottomRightX < NUM_COLS && bottomRightY < NUM_COLS && BOARD[newIdx].textContent === BOARD[startIdx].textContent && bottomRightCount < winAmount){
        bottomRightCount += 1

        bottomRightX += 1
        bottomRightY += 1

        winningIdx.push(newIdx)

        newIdx = bottomRightX + bottomRightY * NUM_COLS
    }

    if(winningIdx.length == winAmount) {
        return winningIdx
    }

    // reset winning position array for the next diagonal
    winningIdx.length = 0
    winningIdx.push(startIdx)

    // for diagonal going from top right to bottom left
    let topRightX = x + 1
    let topRightY = y - 1

    newIdx = topRightX + topRightY * NUM_COLS

    let topRightCount = 0

    while(topRightX < NUM_COLS && topRightY >=0 && BOARD[newIdx].textContent === BOARD[startIdx].textContent && topRightCount < winAmount){
        topRightCount += 1

        topRightX += 1
        topRightY -= 1

        winningIdx.push(newIdx)

        newIdx = topRightX + topRightY * NUM_COLS
    }


    if(winningIdx.length == winAmount) {
        return winningIdx
    }

    let bottomLeftX = x - 1
    let bottomLeftY = y + 1

    newIdx = bottomLeftX + bottomLeftY * NUM_COLS

    let bottomLeftCount = 0

    while(bottomLeftX >= 0 && bottomLeftY < NUM_COLS && BOARD[newIdx].textContent === BOARD[startIdx].textContent && bottomLeftCount < winAmount){
        bottomLeftCount += 1

        bottomLeftX -= 1
        bottomLeftY += 1

        winningIdx.push(newIdx)

        newIdx = bottomLeftX + bottomLeftY * NUM_COLS
    }

    return winningIdx
}




