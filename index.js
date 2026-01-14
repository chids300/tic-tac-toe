
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
    // dont need to check from all indexes, just the one that had a new item

    // array is 0 index
    const endIdx = NUM_COLS - 1

    // check left and right for winner


    // for x direction, check x variable
    // if x is greater than 0 but less than endIdx, then we need to check both left and right direction
    // if x is 0, we check from left until endIdx
    // if x is equal to endIdx then check backwards

    // repeat this but for y variable too

    // diagonals slightly different

    // if i know the row, i can just start from the beginning of that row and check NUM_COLS items

    const isSame = (arr) => {
        const same = arr.every((a) => {
            if(a == "X") {
                return a === arr[0]
            }
            else {
                return false
            }
        })

        return same
    }

    
    const rowStart = 0 + y * endIdx
    const rowEnd = endIdx + y * endIdx

    const row = BOARD.slice(rowStart, rowEnd+1)


    console.log(row)

    if(isSame(row) && !row.includes("0")){
        console.log("winner found")
    }


    // if(x >= 0 && x<endIdx) {
        

    // }
    // else if(x == endIdx) {

    // }
    // else if(x == 0){

    // }



    
    
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





// while(!gameOver){
    
//     if(P1turn){
//         // make selection of where to place item
//         // player clicks div, get index of div in grid, use that index to update position in board
        
//     }
//     else{

//     }

//     // check for winners


    

// }








