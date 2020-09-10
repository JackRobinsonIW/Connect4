/* eslint-disable no-console */

function highlightOn(column) {
  if (gameState.inputValid === true) {
    const row = columnEmptySpace(column, gameState.board);
    if (row === null) {
      return;
    }
    $(`#${row}_${column}`).css('backgroundColor', gameState.player);
  }
}

function highlightOff(column) {
  const row = columnEmptySpace(column, gameState.board);
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
  const newWidth = (parseFloat(width) / gameState.board[0].length) * 0.8;
  const newHeight = (height / gameState.board.length) * 0.9;
  // Take the scale as the minimum of width and height
  const scale = `${Math.min(newWidth, newHeight)}px`;
  // Apply the scale to the board squares
  $('.board-square').css('width', scale).css('height', scale);
}

function drawBoard() {
  // Loop over the array
  for (let i = 0; i < gameState.board.length; i += 1) {
    for (let j = 0; j < gameState.board[i].length; j += 1) {
      // If the array element is not null set the html colour to the string in that element
      if (gameState.board[i][j]) {
        $(`#${i}_${j}`).css('backgroundColor', gameState.board[i][j]);
      }
    }
  }
  // Update scoreboard
  $('#wins-yellow').text(gameState.winCounter[0]);
  $('#wins-red').text(gameState.winCounter[1]);
}

function highlightWinner(winningPoints) {
  for (let index = 0; index < winningPoints.length; index += 1) {
    const i = winningPoints[index][0];
    const j = winningPoints[index][1];
    $(`#${i}_${j}`).css('animation-name', 'highlightWinner');
  }
}

function postTurn(player, i, j) {
  $.ajax({
    url: `http://localhost:8080/takeTurn/${player}/${i}/${j}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      gameState = data;
      console.log(`${i}_${j} Filled clicked`);
      console.log(gameState);
      if (gameState.turnCount === gameState.board.length * gameState.board[0].length) {
        displayDraw();
      }
      if (gameState.winningPoints.length > 0) {
        highlightWinner(gameState.winningPoints);
      }
      highlightOn(j);
    },
  });
}

function squareClicked(column) {
  if (gameState.inputValid === false) {
    return;
  }
  const j = column;
  const i = columnEmptySpace(column, gameState.board);
  if (i === null) {
    return;
  }
  postTurn(gameState.player, i, j);
}

function generateGrid() {
  for (let i = 0; i < gameState.board.length; i += 1) {
    // Create row Divs in "gameboard"
    const rowDiv = $('<div></div>').attr('id', `row${i}`).addClass('row').addClass('board-row');
    // Fill row Div with squares
    for (let j = 0; j < gameState.board[i].length; j += 1) {
      const colDiv = $('<div></div>').attr('id', `${i}_${j}`)
        .addClass('board-square')
        .text('')
        .click(() => squareClicked(j))
        .mouseover(() => highlightOn(j))
        .mouseout(() => highlightOff(j));
      rowDiv.append(colDiv);
    }
    // Add to html
    $('#gameboard').append(rowDiv);
  }
}

function clearGrid() {
  $('#gameboard').empty();
  let rows = $('#rows-input').val();
  let cols = $('#cols-input').val();
  if (!rows) {
    rows = 6;
  }
  if (!cols) {
    cols = 7;
  }
  $.ajax({
    url: `http://localhost:8080/initGameBoard/${rows}/${cols}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      gameState = data;
      generateGrid();
      drawBoard();
      sizeSquares();
      console.log('Clear clicked');
      console.log(gameState);
    },
  });
}

function setLength() {
  const userLength = $('#length-input').val();
  $.ajax({
    url: `http://localhost:8080/initGameLength/${userLength}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      gameState = data;
      $('#connect-length').text(gameState.lengthNeeded);
      console.log('Clear clicked');
      console.log(gameState);
    },
  });
}

function initalRender() {
  $('#length').click(() => setLength());
  $('#clear').click(() => clearGrid());
  generateGrid();
  sizeSquares();
  drawBoard();
  window.addEventListener('resize', () => {
    sizeSquares(gameState.board);
  });
}

function intialGet() {
  $.ajax({
    url: 'http://localhost:8080/gameState',
    type: 'GET',
    crossDomain: true,
    success(data) {
      gameState = data;
      initalRender();
      console.log('Inital data GET');
      console.log(gameState);
    },
  });
}

let gameState = {};
intialGet();
