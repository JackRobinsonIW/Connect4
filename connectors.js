/* eslint-disable no-console */
const winCounter = [0, 0];
const player = 'yellow';
const lengthNeeded = 4;
let inputValid = true;
let turnCount = 0;
let board = [[null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null]];
let gameState = {};

function highlightOn(column) {
  if (inputValid === true) {
    const row = columnEmptySpace(column, board);
    if (row === null) {
      return;
    }
    $(`#${row}_${column}`).css('backgroundColor', player);
  }
}

function highlightOff(column) {
  const row = columnEmptySpace(column, board);
  if (row === null) {
    return;
  }
  $(`#${row}_${column}`).css('backgroundColor', 'white');
}

function displayDraw() {
  $('#myModal').modal('show');
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

// function squareClicked(column) {
//   if (inputValid === false) {
//     return;
//   }
//   const j = column;
//   const i = columnEmptySpace(column, board);
//   if (i === null) {
//     return;
//   }
//   board[i][j] = player;
//   const winningPoints = checkWinner(i, j, lengthNeeded, board);
//   drawBoard();
//   if (winningPoints.length > 0) {
//     winCounter = updateScore(player, winCounter);
//     inputValid = false;
//     drawBoard();
//     highlightWinner(winningPoints);
//   }
//   turnCount += 1;
//   if (turnCount === board.length * board[0].length) {
//     displayDraw();
//   }
//   player = switchPlayer(player);
//   highlightOn(column);
// }

function squareClicked(column) {
  if (inputValid === false) {
    return;
  }
  const j = column;
  const i = columnEmptySpace(column, board);
  if (i === null) {
    return;
  }
  $.ajax({
    url: `http://localhost:8080/takeTurn/${player}/${i}/${j}`,
    type: 'POST',
    crossDomain: true,
    success: console.log('success'),
    error: console.log('error'),
  });
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
        .click(() => squareClicked(j))
        // .mouseover(highlightOn.bind(null, j))
        // .mouseout(highlightOff.bind(null, j));
        .mouseover(() => highlightOn(j))
        .mouseout(() => highlightOff(j));
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
  turnCount = 0;
  generateGrid();
  drawBoard();
  sizeSquares();
}

document.addEventListener('DOMContentLoaded', () => {
  $('#clear').click(() => {
    let userRows = $('#rows-input').val();
    let userCols = $('#cols-input').val();
    if (!userRows) {
      userRows = 6;
    }
    if (!userCols) {
      userCols = 7;
    }
    $.ajax({
      url: `http://localhost:8080/initGameBoard/${userRows}/${userCols}`,
      type: 'POST',
      crossDomain: true,
    });
    clearGrid(); // Delete this once render written
    console.log('Clear clicked');
    // Needs to call render function once written
  });

  $('#length').click(() => {
    $.ajax({
      url: 'http://localhost:8080/gameState',
      type: 'GET',
      crossDomain: true,
      success(data) {
        gameState = data;
        console.log('Length clicked');
        console.log(gameState);
      },
    });
    console.log('Length clicked');
    // Needs to call render function once written
  });
}, false);

window.addEventListener('resize', () => {
  sizeSquares(board);
});

generateGrid();
sizeSquares();
drawBoard();

// $('#length').click(() => {
//   const userLength = $('#length-input').val();
//   // $('#connect-length').text(lengthNeeded); - Move to render function
//   $.ajax({
//     url: `http://localhost:8080/initGameLength/${userLength}`,
//     type: 'POST',
//     crossDomain: true,
//   });
//   console.log('Length clicked');
//   // Needs to call render function once written
// });

// $('#length').click(() => {
// $.ajax({
//   url: 'http://localhost:8080/gameState',
//   type: 'GET',
//   crossDomain: true,
//   success(data) {
//     gameState = data;
//     console.log('Length clicked');
//     console.log(gameState);
//   },
// });
