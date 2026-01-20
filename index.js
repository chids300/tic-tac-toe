let WIN_COUNT = 3
let NUM_COLS = 3

let BOARD_SIZE = NUM_COLS ** 2
const BOARD = []

let P1turn = true
let gameOver = false

const board = document.querySelector("#board")
const statusText = document.querySelector("#status-text")
const restartBtn = document.querySelector("#restart-btn")

restartBtn.addEventListener("click", () => newGame(BOARD_SIZE))

// formula for mapping to row major and mapping it back
// i = X + Y * numCols
// Y = index / numCols
// X = index - (Y * width)

newGame(BOARD_SIZE)

function newGame(board_size) {
    board.innerHTML = ""
    BOARD.length= 0

    statusText.innerHTML = "Player 1s turn"

    let P1turn = true
    let gameOver = false

    for(let i =0; i<board_size; i++){
        var div = document.createElement('div')
        div.classList.add("boardItem")
        div.textContent = ""

        div.style.back

        board.appendChild(div)
        BOARD.push(div)

        div.addEventListener("click", function() {
            if(!gameOver){
                const symbol = P1turn ? 'X' : 'O'

                this.textContent = symbol

                const Y = Math.floor(i / NUM_COLS)
                const X = i - (Y * NUM_COLS)

                const winner = checkForWinner(X, Y, WIN_COUNT)

                if(winner){
                    statusText.innerHTML = `${P1turn ? "Player 1" : "Player 2"} wins`
                    gameOver = true
                }
                else{
                    P1turn = !P1turn
                    statusText.innerHTML = `${P1turn ? "Player 1's" : "Player 2's"} turn`
                }
            }
        })
    }

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


function checkForWinner(x, y, WIN_COUNT) {

    const rows = checkRows(x, y, WIN_COUNT)
    const columns = checkColumns(x, y, WIN_COUNT)
    const diagonal = checkDiags(x, y, WIN_COUNT)

    if(rows.length == WIN_COUNT) {
        const flashInterval = setInterval(() => flashBoardItem(rows), 100)
        setTimeout(() => clearInterval(flashInterval), 3000)

        return true

    } else if(columns.length == WIN_COUNT) {
        const flashInterval = setInterval(() => flashBoardItem(columns), 100)
        setTimeout(() => clearInterval(flashInterval), 3000)

        return true
    }
    else if(diagonal.length == WIN_COUNT) {
        const flashInterval = setInterval(() => flashBoardItem(diagonal), 100)
        setTimeout(() => clearInterval(flashInterval), 3000)

        return true
    }


    return false


}


function checkRows(x, y, winAmount) {
    // want to check on the left and right side of the index
    // start with left side

    const winningIdx = []
    const startIdx = x + y * NUM_COLS;

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


function checkColumns(x, y, winAmount) {
    const startIdx = x + y * NUM_COLS;

    const winningIdx = []
    winningIdx.push(startIdx)

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

function checkDiags(x, y, winAmount) {
    const startIdx = x + y * NUM_COLS
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




