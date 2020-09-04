function squareClicked(row, column, event) {
    if (inputValid === false) {
        return
    }
    let j = column
    let i = columnEmptySpace(board, column)
    if (i === null) {
        return
    }
    board[i][j] = player
    if (checkWinner(board, i, j, player, lengthNeeded)) {
        updateScore(player)
        console.log("The winner is " + player)
        const winnerName = document.getElementById("winner-name");
        winnerName.innerText = player;
        const winnerDisplay = document.getElementById("winner-display");
        winnerDisplay.style.display = "block";
        inputValid = false
    }
    drawBoard(board)
    switchPlayer(player)
}

function checkWinner(board, x, y, player, lengthNeeded) {
    // Make verification string
    let verificationStr = ""
    for (let i = 0; i < lengthNeeded; i++) {
        verificationStr += player
    }

    // Check row
    let str = ""
    for (let i = 0; i < board[x].length; i++) {
        str += board[x][i]
    }
    if (str.includes(verificationStr)) {
        return true
    }

    // Check column
    str = ""
    for (let j = 0; j < board.length; j++) {
        str += board[j][y]
    }
    if (str.includes(verificationStr)) {
        return true
    }

    // Check leading diagonal
    str = ""
        // Find origin of diagonal
    let offset = Math.min(x, y)
    let i = x - offset
    let j = y - offset
    while (j < board[x].length && i < board.length) {
        str += board[i][j]
        i++
        j++
    }
    if (str.includes(verificationStr)) {
        return true
    }

    // Check counter diagonal
    str = ""
        // Find origin of diagonal
    offset = Math.min(board.length - 1 - x, y)
    i = x + offset
    j = y - offset
    while (j < board[x].length && i >= 0) {
        str += board[i][j]
        i--
        j++
    }
    if (str.includes(verificationStr)) {
        return true
    }

    return false
}

function updateScore(player) {
    if (player === "yellow") {
        win_counter[0]++
    } else {
        win_counter[1]++
    }
}

function switchPlayer() {
    if (player === "yellow") {
        player = "red"
    } else {
        player = "yellow"
    }
}

function createEmptyBoardState(rows, columns) {
    // Create empty array
    const boardState = []
    for (let i = 0; i < rows; i++) {
        // Create row and fill it with null
        boardState.push([])
        for (let j = 0; j < columns; j++) {
            boardState[i].push(null)
        }
    }
    return boardState
}

function columnEmptySpace(board, column) {
    let index = null
    for (let row = 0; row < board.length; row++) {
        if (board[row][column] === null) {
            index = row
        }
    }
    return index
}

function generateGrid(board) {
    for (let i = 0; i < board.length; i++) {
        // Create row Divs
        const rowDiv = document.createElement("div")
        rowDiv.id = "row-" + i
        rowDiv.classList.add("row")
        rowDiv.classList.add("board-row")
            // Fill row Div with squares
        for (let j = 0; j < board[i].length; j++) {
            const colDiv = document.createElement("div")
            colDiv.id = i + "," + j
            colDiv.classList.add("board-square")
            colDiv.textContent = ""
            colDiv.addEventListener("click", squareClicked.bind(null, i, j));
            colDiv.addEventListener("mouseover", mouseOver.bind(null, i, j))
            colDiv.addEventListener("mouseout", mouseOut.bind(null, i, j))
            rowDiv.appendChild(colDiv)
        }
        // Add to html
        document.getElementById("gameboard").appendChild(rowDiv)
    }
}

function sizeSquares(board) {
    // Get usable width and height
    const width = getComputedStyle(document.getElementById("gameboard")).width
    const titleheight = getComputedStyle(document.getElementById("title")).height
    const height = window.innerHeight - parseFloat(titleheight);
    // Calculate new desired width and height
    const newWidth = parseFloat(width) / board[0].length * 0.8
    const newHeight = height / board.length * 0.9
        // Take the scale as the minimum of width and height
    const scale = Math.min(newWidth, newHeight) + "px"
        // Apply the scale to the board squares
    const squares = document.getElementsByClassName('board-square');
    for (i = 0; i < squares.length; i++) {
        squares[i].style.width = scale
        squares[i].style.height = scale
    }
}

function drawBoard(board) {
    // Loop over the array
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            // If the array element is not null set the html colour to the string in that element
            if (board[i][j]) {
                document.getElementById(i + "," + j).style.backgroundColor = board[i][j]
            }
        }
    }
    // Update scoreboard
    const wincountYellow = document.getElementById("wins-yellow")
    const wincountRed = document.getElementById("wins-red")
    wincountYellow.innerText = win_counter[0]
    wincountRed.innerText = win_counter[1]
}

function clearGrid() {
    inputValid = true
    const winnerDisplay = document.getElementById("winner-display");
    winnerDisplay.style.display = "none";
    const gameboard = document.getElementById("gameboard");
    while (gameboard.firstChild) {
        gameboard.removeChild(gameboard.firstChild);
    }
    rows = document.getElementById("rows-input").value;
    cols = document.getElementById("cols-input").value;
    if (!rows) {
        rows = 6;
    }
    if (!cols) {
        cols = 7;
    }
    board = createEmptyBoardState(rows, cols);
    generateGrid(board)
    drawBoard(board)
    sizeSquares(board)
}

function mouseOver(row, column, event) {
    if (inputValid === true) {
        row = columnEmptySpace(board, column)
        document.getElementById(row + "," + column).style.backgroundColor = player
    }
}

function mouseOut(row, column, event) {
    row = columnEmptySpace(board, column)
    document.getElementById(row + "," + column).style.backgroundColor = "white"
}

module.exports = {
    columnEmptySpace: columnEmptySpace,
    createEmptyBoardState: createEmptyBoardState,
    switchPlayer: switchPlayer,
    updateScore: updateScore,
    checkWinner: checkWinner,
}