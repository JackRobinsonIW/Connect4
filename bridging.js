const {
  columnEmptySpace, checkWinner,
  updateScore, switchPlayer,
  createEmptyBoardState,
} = require('./main.js');

let winCounter = [0, 0];
let player = 'yellow';
let lengthNeeded = 4;
let inputValid = true;
let board = [[null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null]];

function mouseOver(column) {
  if (inputValid === true) {
    const row = columnEmptySpace(column, board);
    if (row === null) {
      return;
    }
    $(`#${row}_${column}`).css('backgroundColor', player);
  }
}

function mouseOut(column) {
  const row = columnEmptySpace(column, board);
  if (row === null) {
    return;
  }
  $(`#${row}_${column}`).css('backgroundColor', 'white');
}

function sizeSquares() {
  // Get usable width and height
  const width = $('#gameboard').css('width');
  const titleheight = $('#title').css('height');
  const height = window.innerHeight - parseFloat(titleheight);
  // Calculate new desired width and height
  const newWidth = (parseFloat(width) / board[0].length) * 0.8;
  const newHeight = (height / board.length) * 0.9;
  // Take the scale as the minimum of width and height
  const scale = `${Math.min(newWidth, newHeight)}px`;
  // Apply the scale to the board squares
  $('.board-square').css('width', scale).css('height', scale);
}

function drawBoard() {
  // Loop over the array
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[i].length; j += 1) {
      // If the array element is not null set the html colour to the string in that element
      if (board[i][j]) {
        $(`#${i}_${j}`).css('backgroundColor', board[i][j]);
      }
    }
  }
  // Update scoreboard
  $('#wins-yellow').text(winCounter[0]);
  $('#wins-red').text(winCounter[1]);
}

function highlightWinner(winningPoints) {
  for (let index = 0; index < winningPoints.length; index += 1) {
    const i = winningPoints[index][0];
    const j = winningPoints[index][1];
    $(`#${i}_${j}`).css('animation-name', 'highlightWinner');
  }
}

function squareClicked(column) {
  if (inputValid === false) {
    return;
  }
  const j = column;
  const i = columnEmptySpace(column, board);
  if (i === null) {
    return;
  }
  board[i][j] = player;
  const winningPoints = checkWinner(i, j, lengthNeeded, board);
  drawBoard(board);
  if (winningPoints.length > 1) {
    winCounter = updateScore(player, winCounter);
    inputValid = false;
    drawBoard(board);
    highlightWinner(winningPoints);
  }
  player = switchPlayer(player);
  mouseOver(column);
}

function generateGrid() {
  for (let i = 0; i < board.length; i += 1) {
    // Create row Divs in "gameboard"
    const rowDiv = $('<div></div>').attr('id', `row${i}`).addClass('row').addClass('board-row');
    // Fill row Div with squares
    for (let j = 0; j < board[i].length; j += 1) {
      const colDiv = $('<div></div>').attr('id', `${i}_${j}`)
        .addClass('board-square')
        .text('')
        .click(squareClicked.bind(null, j))
        .mouseover(mouseOver.bind(null, j))
        .mouseout(mouseOut.bind(null, j));
      rowDiv.append(colDiv);
    }
    // Add to html
    $('#gameboard').append(rowDiv);
  }
}

function clearGrid() {
  inputValid = true;
  $('#gameboard').empty();
  let rows = $('#rows-input').val();
  let cols = $('#cols-input').val();
  if (!rows) {
    rows = 6;
  }
  if (!cols) {
    cols = 7;
  }
  board = createEmptyBoardState(rows, cols);
  generateGrid();
  drawBoard(board);
  sizeSquares(board);
}

function setLength() {
  lengthNeeded = $('#length-input').val();
  $('#connect-length').text(lengthNeeded);
}

document.addEventListener('DOMContentLoaded', () => {
  $('#clear').click(clearGrid);
  $('#length').click(setLength);
}, false);

window.addEventListener('resize', () => {
  sizeSquares(board);
});

generateGrid();
sizeSquares();
drawBoard();
