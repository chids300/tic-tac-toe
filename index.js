const WIN_COUNT = 3
let NUM_COLS = 3
const BOARD_SIZE = NUM_COLS ** 2

const BOARD = Array(BOARD_SIZE)
BOARD.fill("0")

let P1turn = true
let gameOver = false

const board = document.querySelector("#board")
const statusText = document.querySelector("#status-text")

statusText.innerHTML = "Player 1s turn"


// formula for mapping to row major and mapping it back
// i = X + Y * numCols
// Y = index / numCols
// X = index - (Y * width)




for(let i =0; i<BOARD_SIZE; i++){
    var div = document.createElement('div')
    //var button = document.createElement('button')

    board.appendChild(div)
    div.classList.add("boardItem")

    //div.appendChild(button)
    // pass index to event listener
    // so we can easily map the 

    div.addEventListener("click", function() {
        if(!gameOver){
            const symbol = P1turn ? 'X' : 'O'

            BOARD[i] = symbol
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

function restartGame() {
    window.location.reload()
}


function checkForWinner(x, y, WIN_COUNT) {

    const isRow = checkRows(x, y, WIN_COUNT)
    const isColumn = checkColumns(x, y, WIN_COUNT)
    const isDiag = checkDiags(x, y, WIN_COUNT)

    if( isRow || isColumn || isDiag) {
        return true
    }

}

function checkRows(x, y, winAmount) {
    // want to check on the left and right side of the index
    // start with left side

    const startIdx = x + y * NUM_COLS;

    let leftCount = 0

    let leftX = x - 1
    let leftIdx = leftX + y * NUM_COLS;

    while(leftX >=0 && BOARD[leftIdx] === BOARD[startIdx]){
        leftCount++ 
        leftX -= 1

        leftIdx = leftX + y * NUM_COLS
    }

    if((leftCount + 1) >= winAmount){
        return true
    }

    let rightCount = 0

    let rightX = x + 1
    let rightIdx = rightX + y * NUM_COLS

    while(rightX < NUM_COLS && BOARD[rightIdx] === BOARD[startIdx]){
        rightCount++
        rightX++

        rightIdx = rightX + y * NUM_COLS
    }

    console.log(leftCount, rightCount)

    if((leftCount + rightCount + 1) >= winAmount) {
        return true
    }

    return false
}


function checkColumns(x, y, winAmount) {
    const startIdx = x + y * NUM_COLS;

    let topY = y - 1
    let newIdx = x + topY * NUM_COLS
    let topCount = 0

    while(topY >= 0 && BOARD[newIdx] === BOARD[startIdx] && topCount <= winAmount){
        topCount += 1

        topY -= 1
        newIdx = x + topY * NUM_COLS
    }

    if((topCount + 1) >= winAmount) {
        return true
    }

    let bottomY = y + 1
    let bottomCount = 0

    newIdx = x + bottomY * NUM_COLS

    while(bottomY < NUM_COLS && BOARD[newIdx] === BOARD[startIdx] && bottomCount <= winAmount){
        bottomCount += 1
        bottomY += 1

        newIdx = x + bottomY * NUM_COLS
    }

    if((bottomCount + topCount + 1) >= winAmount) {
        return true
    }

    return false

}

function checkDiags(x, y, winAmount) {
    const startIdx = x + y * NUM_COLS

    // for diagonal goin from top left to bottom right
    let topLeftX = x - 1
    let topLeftY = y - 1

    let newIdx = topLeftX + topLeftY * NUM_COLS
    
    let topLeftCount = 0

    while(topLeftX >= 0 && topLeftY>=0 && BOARD[newIdx] === BOARD[startIdx]){
        topLeftCount += 1
        topLeftX -= 1
        topLeftY -= 1

        newIdx = topLeftX + topLeftY * NUM_COLS
    }

    if((topLeftCount + 1) >= winAmount) {
        return true
    }

    let bottomRightX = x + 1
    let bottomRightY = y + 1

    newIdx = bottomRightX + bottomRightY * NUM_COLS

    let bottomRightCount = 0

    while(bottomRightX < NUM_COLS && bottomRightY < NUM_COLS && BOARD[newIdx] === BOARD[startIdx]){
        bottomRightCount += 1

        bottomRightX += 1
        bottomRightY += 1

        newIdx = bottomRightX + bottomRightY * NUM_COLS
    }

    if((bottomRightCount + topLeftCount + 1) >= winAmount) {
        return true
    }

    // for diagonal going from top right to bottom left
    let topRightX = x + 1
    let topRightY = y - 1

    newIdx = topRightX + topRightY * NUM_COLS

    let topRightCount = 0

    while(topRightX < NUM_COLS && topRightY >=0 && BOARD[newIdx] === BOARD[startIdx]){
        topRightCount += 1

        topRightX += 1
        topRightY -= 1

        newIdx = topRightX + topRightY * NUM_COLS
    }


    if((topRightCount + 1) >= winAmount) {
        return true
    }

    let bottomLeftX = x - 1
    let bottomLeftY = y + 1

    newIdx = bottomLeftX + bottomLeftY * NUM_COLS

    let bottomLeftCount = 0

    while(bottomLeftX >= 0 && bottomLeftY < NUM_COLS && BOARD[newIdx] === BOARD[startIdx]){
        bottomLeftCount += 1

        bottomLeftX -= 1
        bottomLeftY += 1

        newIdx = bottomLeftX + bottomLeftY * NUM_COLS
    }

    if((bottomLeftCount + topRightCount + 1) >= winAmount) {
        return true
    }

    return false
}




