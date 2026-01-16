
let NUM_COLS = 3
const BOARD_SIZE = NUM_COLS ** 2

const BOARD = Array(BOARD_SIZE)
BOARD.fill("0")

const P1turn = true
let gameOver = false

var board = document.querySelector("#board")

// set up event listeners for all the buttons

// formula for mapping to row major and mapping it back
// i = X + Y * numCols
// Y = index / numCols
// X = index - (Y * width)

function checkForWinner(x, y) {

    const isRow = checkRows(x, y, "X")
    const isColumn = checkColumns(x, y, "X")
    const isDiag = checkDiags(x, y, "X")

    if( isRow || isColumn || isDiag) {
        console.log("we found a winner")
    }

}

function checkRows(x, y, symbol) {

    const rowStart = 0 + y * NUM_COLS
    const rowEnd = NUM_COLS + y * NUM_COLS
    const row = BOARD.slice(rowStart, rowEnd)
    const isSame = row.every(r => r === symbol)


    if(isSame && !row.includes("0")){
        console.log("winner found in the row")
        return true
    }
    else{
        return false
    }
}


function checkColumns(x, y, symbol) {
    let colIdx = x + 0 * NUM_COLS;
    let prev = BOARD[colIdx]
    let count = 1

    for(let i=1; i<NUM_COLS; i++){
        colIdx = x + i * NUM_COLS
        if(prev == BOARD[colIdx] && BOARD[colIdx] != '0'){
            count++
            prev = BOARD[colIdx]
        }
        else {
            count = 0
        }

        if(count == NUM_COLS){
            break;
        }
    }

    if(count == NUM_COLS){
        console.log("winner found in column")
        return true
    }
    else{
        return false
    }
}

function checkDiags(x, y, symbol) {
    let topX = x - 1
    let topY = y - 1
    const idx = x + y * NUM_COLS

    console.log(topX, topY)
    
    let diagCount = 0

    while(topX >= 0 && topY>=0 ){
        const newIdx = topX + topY * NUM_COLS

        console.log(BOARD[newIdx])

        if(BOARD[idx] === BOARD[newIdx]){
            diagCount += 1
        }
        else {
            break
        }

        topX -= 1
        topY -= 1
    }

    let leftRightDiag = diagCount

    diagCount = 0
    topX = x + 1
    topY = y + 1 

    while(topX < NUM_COLS && topY < NUM_COLS){
        const newIdx = topX + topY * NUM_COLS

        if(BOARD[idx] === BOARD[newIdx]){
            diagCount += 1
        }
        else {
            break
        }

        topX += 1
        topY +=1
    }


    leftRightDiag += diagCount + 1;

    // early return here if found in top left
    if(leftRightDiag == NUM_COLS){
        console.log("winner in top left to bottom right diagonal")

        return true
    }


    let rightLeftDiag = 0

    diagCount = 0
    topX = x + 1
    topY = y - 1 

    console.log(topX, topY)

    while(topX < NUM_COLS && topY >= 0){
        const newIdx = topX + topY * NUM_COLS

        if(BOARD[idx] === BOARD[newIdx]){
            diagCount += 1
        }
        else {
            break
        }

        topX += 1
        topY -=1
    }

    rightLeftDiag += diagCount

    diagCount = 0
    topX = x - 1
    topY = y + 1 

    while(topX >= 0 && topY < NUM_COLS){
        const newIdx = topX + topY * NUM_COLS

        if(BOARD[idx] === BOARD[newIdx]){
            diagCount += 1
        }
        else {
            break
        }

        topX -= 1
        topY +=1
    }

    rightLeftDiag += diagCount
    rightLeftDiag += 1

    if(rightLeftDiag == NUM_COLS) {
        return true
    }

    return false
}



for(let i =0; i<BOARD_SIZE; i++){
    var div = document.createElement('div')
    //var button = document.createElement('button')

    board.appendChild(div)
    div.innerHTML = "0"

    //div.appendChild(button)

    // pass index to event listener
    // so we can easily map the 
    div.addEventListener("click", function() {
        console.log(`item index ${i} clicked`)

        const Y = Math.floor(i / NUM_COLS)
        const X = i - (Y * NUM_COLS)

        console.log(`xpos is ${X}, y pos is ${Y}`)
        this.innerHTML = "X"
        BOARD[i] = "X"

        checkForWinner(X, Y)
    })

}



