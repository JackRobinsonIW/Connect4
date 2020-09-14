/* eslint-disable no-console */

let gameState = {};

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

function displayModal() {
  // Show draw message
  $('#myModal').modal('show');
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
  $('#wins-yellow').text(gameState.winCounter[1]);
  $('#wins-red').text(gameState.winCounter[0]);
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
    url: `http://localhost:8080/takeTurn/${player}/${i}/${j}`,
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to date with server
      gameState = data;
      console.log(`${i}_${j} clicked - ${player}`);
      console.log(gameState);
      // Check if a draw has occured
      if (gameState.turnCount === gameState.board.length * gameState.board[0].length) {
        displayModal();
      }
      // Highlight points if there is a winner
      if (gameState.winningPoints.length > 0) {
        highlightWinner(gameState.winningPoints);
        $('#modal-text').text(`${capitalisePlayer(switchPlayer(gameState.player))} wins! - Press Clear Grid to reset the board.`);
        displayModal();
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
    url: `http://localhost:8080/initGameBoard/${rows}/${cols}`,
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
    url: `http://localhost:8080/initGameLength/${userLength}`,
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

function initalRender() {
  // Add click events to buttons
  $('#length').click(() => setLength());
  $('#clear').click(() => clearGrid());
  // Draw all inital html elements
  generateGrid();
  sizeSquares();
  drawBoard();
  // Add rezie listener to the window
  window.addEventListener('resize', () => {
    sizeSquares(gameState.board);
  });
}

function intialGet() {
  // Make the first get request from the server for the inital gameState
  $.ajax({
    url: 'http://localhost:8080/gameState',
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
