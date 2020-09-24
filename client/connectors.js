/* eslint-disable no-console */
const url = 'http://localhost:3008';
let gameState = {};
let gameId = null;
let userId = '';
let games = [];
$(() => {
  $('#start-modal').modal({ backdrop: 'static', keyboard: false });
});

function listGames() {
  games.forEach((element) => {
    $('#games').append(`<option value=${element}>${element}</option>`);
  });
}

function columnEmptySpace(column, boardState) {
  // Finds and returns the lowest empty rows of a column
  for (let row = boardState.length - 1; row >= 0; row -= 1) {
    if (boardState[row][column] === null) {
      return row;
    }
  }
  // Returns null if none found
  return null;
}

function highlightOn(column) {
  // Find empty square in a column if there is one
  if (gameState.inputValid === true) {
    const row = columnEmptySpace(column, gameState.board);
    if (row === null) {
      return;
    }
    // Highlight square with piece
    $(`#${row}_${column}`).css('backgroundColor', gameState.player);
  }
}

function highlightOff(column) {
  // Reverse the highlightOn function
  const row = columnEmptySpace(column, gameState.board);
  if (row === null) {
    return;
  }
  $(`#${row}_${column}`).css('backgroundColor', 'white');
}

function displayModal(modalId) {
  // Show draw message
  $(modalId).modal('show');
}

function capitalisePlayer(player) {
  return player.charAt(0).toUpperCase() + player.slice(1);
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
  const fontScale = `${Math.min(newWidth, newHeight) / 3}px`;

  // Apply the scale to the board squares
  $('.board-square').css('width', scale).css('height', scale);
  $('#wincount-yellow').css('width', scale).css('height', scale);
  $('#wincount-red').css('width', scale).css('height', scale);
  $('#scoreboard').css('font-size', fontScale);
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
  // Loop over array adding winner animation to each point
  for (let index = 0; index < winningPoints.length; index += 1) {
    const i = winningPoints[index][0];
    const j = winningPoints[index][1];
    $(`#${i}_${j}`).css('animation-name', 'highlightWinner');
  }
}

function switchPlayer(player) {
  return (player === 'yellow' ? 'red' : 'yellow');
}

function postTurn(player, i, j) {
  // Send post request to place piece in (i,j) for 'player'
  $.ajax({
    url: `${url}/takeTurn/${player}/${i}/${j}/${gameId}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to date with server
      gameState = data;
      console.log(`${i}_${j} clicked - ${player}`);
      console.log(gameState);
      // Check if a draw has occured
      if (gameState.turnCount === gameState.board.length * gameState.board[0].length) {
        displayModal('#myModal');
      }
      // Highlight points if there is a winner
      if (gameState.winningPoints.length > 0) {
        highlightWinner(gameState.winningPoints);
        $('#modal-text').text(`${capitalisePlayer(switchPlayer(gameState.player))} wins! - Press Clear Grid to reset the board.`);
        displayModal('#myModal');
      }
      drawBoard();
      // Call highlightOn on the same column
      highlightOn(j);
    },
  });
}

function squareClicked(column) {
  // Check the game is not over and a move can be made
  if (gameState.inputValid === false) {
    return;
  }
  // Check the column has an empty space
  const j = column;
  const i = columnEmptySpace(column, gameState.board);
  if (i === null) {
    return;
  }
  // Send post request to place a piece
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
  // Empty html
  $('#gameboard').empty();
  // Read user input values
  let rows = $('#rows-input').val();
  let cols = $('#cols-input').val();
  // Check input exists
  if (!rows) {
    rows = 6;
  }
  if (!cols) {
    cols = 7;
  }
  // Send reset board post request
  $.ajax({
    url: `${url}/initGameBoard/${rows}/${cols}/${gameId}/${userId}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to data with server
      gameState = data;
      // Update client side UI
      $('#modal-text').text('Draw! - Press Clear Grid to reset the board.');
      generateGrid();
      drawBoard();
      sizeSquares();
      console.log('Clear clicked');
      console.log(gameState);
    },
  });
}

function setLength() {
  // Send post request with dersired length
  const userLength = $('#length-input').val();
  $.ajax({
    url: `${url}/initGameLength/${userLength}/${gameId}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to data with server
      gameState = data;
      // Update client side UI
      $('#connect-length').text(gameState.lengthNeeded);
      console.log('Clear clicked');
      console.log(gameState);
    },
  });
}

function resetSave() {
  $.ajax({
    url: `${url}/resetSave/${gameId}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to data with server
      gameState = data;
      clearGrid();
      console.log('Reset save clicked');
      console.log(gameState);
    },
  });
}

function joinSave() {
  gameId = $('#modal-id').val();
  $.ajax({
    url: `${url}/loadSave/${gameId}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to data with server
      gameState = data;
      $('#game-modal').modal('hide');
      generateGrid();
      sizeSquares();
      drawBoard();
    },
  });
}

function guestLogin() {
  $.ajax({
    url: `${url}/guestUser`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      userId = data;
      games = [];
      $('#start-modal').modal('hide');
      $('#game-modal').modal({ backdrop: 'static', keyboard: false });
    },
  });
}

function userLogin() {
  const user = $('#username').val();
  const password = $('#password').val();
  if (user === '' || password === '') {
    console.log('input not valid');
    return;
  }
  $.ajax({
    url: `${url}/loginUser/${user}/${password}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      userId = data[0];
      games = data[1];
      listGames();
      $('#start-modal').modal('hide');
      $('#game-modal').modal({ backdrop: 'static', keyboard: false });
    },
    error(xhr, textstatus, errorthrown) {
      if (textstatus === 'error') {
        $('#password-error').css('display', 'block');
        console.log('error thrown');
        console.log(errorthrown);
        console.log(xhr.responseText);
      }
    },
  });
}

function newGame() {
  const rows = $('#rows').val();
  const cols = $('#cols').val();
  const length = $('#length').val();
  gameId = $('#name').val();
  $.ajax({
    url: `${url}/newGame/${rows}/${cols}/${length}/${gameId}/${userId}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to data with server
      gameState = data;
      // Update client side UI
      $('#connect-length').text(gameState.lengthNeeded);
      $('#modal-text').text('Draw! - Press Clear Grid to reset the board.');
      generateGrid();
      drawBoard();
      sizeSquares();
      $('#game-modal').modal('hide');
    },
  });
}

function refreshState() {
  $.ajax({
    url: `${url}/gameState/${gameId}`,
    type: 'GET',
    crossDomain: true,
    success(data) {
      gameState = data;
      sizeSquares();
      drawBoard();
      console.log('Refresh');
      console.log(gameState);
    },
  });
}

function loadSave() {
  gameId = $('#games').val();
  $.ajax({
    url: `${url}/loadSave/${gameId}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to data with server
      gameState = data;
      $('#game-modal').modal('hide');
      generateGrid();
      sizeSquares();
      drawBoard();
    },
  });
}

function initalRender() {
  // Add click events to buttons
  $('#refresh').click(() => refreshState());
  $('#length').click(() => setLength());
  $('#clear').click(() => clearGrid());
  $('#guest').click(() => guestLogin());
  $('#login').click(() => userLogin());
  $('#load-game').click(() => loadSave());
  $('#join-game').click(() => joinSave());
  $('#new-game').click(() => newGame());
  // Draw all inital html elements
  // generateGrid(); Maybe uncomment ############################
  // sizeSquares();
  // drawBoard();
  // Add rezie listener to the window
  window.addEventListener('resize', () => {
    sizeSquares(gameState.board);
  });
}

function intialGet() {
  // Make the first get request from the server for the inital gameState
  $.ajax({
    url: `${url}/gameState/${gameId}`,
    type: 'GET',
    crossDomain: true,
    success(data) {
      gameState = data;
      // Render html based on the inital gameState data
      initalRender();
      console.log('Inital data GET');
      console.log(gameState);
    },
  });
}

intialGet();

if (typeof module !== 'undefined') {
  module.exports = {
    postTurn,
    resetSave,
    setLength,
    loadSave,
  };
}
