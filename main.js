let board
let playerTurn = "yellow"

function createEmptyBoardState(rows, columns) {
    const boardState = []
    for (let i = 0; i < rows; i++) {
        boardState.push([])
        for (let j = 0; j < columns; j++) {
            boardState[i].push(null)
        }
    }
    return boardState
}

function generateGrid(rows, columns) {
    const rootDiv = document.createElement("div")
    board = createEmptyBoardState(rows, columns)
    console.log(board)
    rootDiv.id = "game-board"
    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement("div")
        rowDiv.id = "row-" + i
        rowDiv.classList.add("row")
        rowDiv.classList.add("board-row")
        for (let j = 0; j < columns; j++) {
            const colDiv = document.createElement("div")
            colDiv.id = i + "," + j
            colDiv.classList.add("board-item")
            colDiv.textContent = ""
            colDiv.addEventListener("click", squareClicked.bind(null, i, j));
            rowDiv.appendChild(colDiv)
        }
        rootDiv.appendChild(rowDiv)
    }
    document.getElementById("board-container").appendChild(rootDiv)
    document.getElementById("game-board").style.width = "" + columns * 6 + "em";
    document.getElementById("game-board").style.height = "" + rows * 6 + "em";
}


function gridSpawn() {
    const boardContainer = document.getElementById("board-container");
    while (boardContainer.firstChild) {
        boardContainer.removeChild(boardContainer.lastChild);
    }
    rows = document.getElementById("rows-input").value
    cols = document.getElementById("cols-input").value
    generateGrid(rows, cols)
}

function columnEmpty(column) {
    let index = null
    for (let row = 0; row < board.length; row++) {
        if (board[row][column] === null) {
            index = row
        }
    }
    return index
}

function squareClicked(row, column, event) {
    console.log(row, column)
    let i = columnEmpty(column)
    let j = column
    console.log(i, j)
    board[i][j] = playerTurn
    document.getElementById(i + "," + j).style.backgroundColor = playerTurn;
    if (playerTurn === "yellow") {
        playerTurn = "red"
    } else {
        playerTurn = "yellow"
    }
}

document.getElementById("spawn").onclick = function() { gridSpawn() };
document.addEventListener('DOMContentLoaded', function() {
    generateGrid(6, 7)
}, false);