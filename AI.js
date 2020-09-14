/* eslint-disable no-console */

function toggleAI(ai) {
  return (!ai);
}

function verificationStr(lengthNeeded) {
  let yellowStr = '';
  let redStr = '';
  for (let i = 0; i < lengthNeeded; i += 1) {
    yellowStr += 'yellow';
    redStr += 'red';
  }
  return [yellowStr, redStr];
}

function checkRows(boardstate, lengthNeeded) {
  const winningStringArray = verificationStr(lengthNeeded);
  for (let i = 0; i < boardstate.length; i += 1) {
    let row = '';
    for (let j = 0; j < boardstate[0].length; j += 1) {
      row += boardstate[i][j];
    }
    if (row.includes(winningStringArray[0])) {
      return 'yellow';
    }
    if (row.includes(winningStringArray[1])) {
      return 'red';
    }
  }
  return null;
}

function checkCols(boardstate, lengthNeeded) {
  const winningStringArray = verificationStr(lengthNeeded);
  for (let j = 0; j < boardstate[0].length; j += 1) {
    let col = '';
    for (let i = 0; i < boardstate.length; i += 1) {
      col += boardstate[i][j];
    }
    if (col.includes(winningStringArray[0])) {
      return 'yellow';
    }
    if (col.includes(winningStringArray[1])) {
      return 'red';
    }
  }
  return null;
}

function checkLeadingDiag(boardstate, lengthNeeded) {
  const winningStringArray = verificationStr(lengthNeeded);
  for (let j = 0; j < boardstate[0].length; j += 1) {
    let diag = '';
    let x = 0;
    let y = j;
    for (let i = 0; i < Math.min(boardstate.length, boardstate[0].length - j); i += 1) {
      diag += boardstate[x][y];
      x += 1;
      y += 1;
    }
    if (diag.includes(winningStringArray[0])) {
      return 'yellow';
    }
    if (diag.includes(winningStringArray[1])) {
      return 'red';
    }
  }
  for (let i = 1; i < boardstate.length; i += 1) {
    let diag = '';
    let x = i;
    let y = 0;
    for (let j = 0; j < boardstate.length - i; j += 1) {
      diag += boardstate[x][y];
      x += 1;
      y += 1;
    }
    if (diag.includes(winningStringArray[0])) {
      return 'yellow';
    }
    if (diag.includes(winningStringArray[1])) {
      return 'red';
    }
  }
  return null;
}

function checkAntiDiag(boardstate, lengthNeeded) {
  const winningStringArray = verificationStr(lengthNeeded);
  for (let j = 0; j < boardstate[0].length; j += 1) {
    let diag = '';
    let x = 0;
    let y = j;
    for (let i = 0; i < Math.min(boardstate.length, j); i += 1) {
      diag += boardstate[x][y];
      x += 1;
      y -= 1;
    }
    if (diag.includes(winningStringArray[0])) {
      return 'yellow';
    }
    if (diag.includes(winningStringArray[1])) {
      return 'red';
    }
  }
  for (let i = 1; i < boardstate.length; i += 1) {
    let diag = '';
    let x = i;
    let y = boardstate[0].length;
    for (let j = 0; j < boardstate.length - i; j += 1) {
      diag += boardstate[x][y];
      x += 1;
      y -= 1;
    }
    if (diag.includes(winningStringArray[0])) {
      return 'yellow';
    }
    if (diag.includes(winningStringArray[1])) {
      return 'red';
    }
  }
  return null;
}

function checkStateForWinner(boardstate, lengthNeeded) {
  const score = [
    checkRows(boardstate, lengthNeeded),
    checkCols(boardstate, lengthNeeded),
    checkLeadingDiag(boardstate, lengthNeeded),
    checkAntiDiag(boardstate, lengthNeeded),
  ];
  if (score.includes('yellow')) {
    return 'yellow';
  }
  if (score.includes('red')) {
    return 'red';
  }
  return null;
}

function staticEvaluation(boardState, lengthNeeded) {
  const winner = checkStateForWinner(boardState, lengthNeeded);
  if (winner === 'yellow') {
    return 100;
  }
  if (winner === 'red') {
    return -100;
  }
  const oneOff = checkStateForWinner(boardState, lengthNeeded - 1);
  if (oneOff === 'yellow') {
    return 80;
  }
  if (oneOff === 'red') {
    return -80;
  }
  if (lengthNeeded - 2 <= 0) {
    return 0;
  }
  const twoOff = checkStateForWinner(boardState, lengthNeeded - 2);
  if (twoOff === 'yellow') {
    return 50;
  }
  if (twoOff === 'red') {
    return -50;
  }
  return 0;
}

function findMoves(boardState) {
  const moves = [];
  for (let j = 0; j < boardState[0].length; j += 1) {
    const i = columnEmptySpace(j, boardState);
    if (i !== null) {
      moves.push([i, j]);
    }
  }
  return moves;
}

function generateChildren(boardState, maximisingPlayer) {
  const children = [];
  let player = '';
  if (maximisingPlayer) {
    player = 'yellow';
  } else {
    player = 'red';
  }
  const moves = findMoves(boardState);
  for (let i = 0; i < moves.length; i += 1) {
    const childState = JSON.parse(JSON.stringify(boardState));
    childState[moves[i][0]][moves[i][1]] = player;
    children.push(childState);
  }
  return children;
}

function minimax(boardState, depth, alpha, beta, maximisingPlayer, requiredLength) {
  const gameOver = checkStateForWinner(boardState, requiredLength);
  if (depth === 0 || gameOver !== null) {
    if (maximisingPlayer) {
      return staticEvaluation(boardState, requiredLength) - depth;
    }
    return staticEvaluation(boardState, requiredLength) + depth;
  }

  if (maximisingPlayer) {
    let maxEval = -Infinity;
    const children = generateChildren(boardState, true);
    for (let i = 0; i < children.length; i += 1) {
      const childEval = minimax(children[i], depth - 1, alpha, beta, false, requiredLength);
      maxEval = Math.max(maxEval, childEval);
      alpha = Math.max(alpha, childEval);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  }
  let minEval = Infinity;
  const children = generateChildren(boardState, false);
  for (let i = 0; i < children.length; i += 1) {
    const childEval = minimax(children[i], depth - 1, alpha, beta, true, requiredLength);
    minEval = Math.min(minEval, childEval);
    beta = Math.min(beta, childEval);
    if (beta <= alpha) {
      break;
    }
  }
  return minEval;
}

function minimaxNextMove(boardState, depth, maximisingPlayer, requiredLength) {
  const moves = findMoves(boardState);
  const children = generateChildren(boardState, maximisingPlayer);
  const scores = [];
  const alpha = -Infinity;
  const beta = Infinity;
  for (let i = 0; i < children.length; i += 1) {
    scores.push(minimax(children[i], depth, alpha, beta, !maximisingPlayer, requiredLength));
  }
  let maxScore = 0;
  if (maximisingPlayer) {
    maxScore = scores.reduce((a, b) => Math.max(a, b));
  } else {
    maxScore = scores.reduce((a, b) => Math.min(a, b));
  }
  return moves[scores.indexOf(maxScore)];
}

const express = require('express');
const cors = require('cors');
const {
  createEmptyBoardState, switchPlayer, checkWinner, updateScore, toggleAI, minimaxNextMove,
} = require('./main.js');

const app = express();
app.use(cors());
app.use(express.json());

// Inital server gameState
const gameState = {
  turnCount: 0,
  player: 'yellow',
  inputValid: true,
  lengthNeeded: 4,
  winCounter: [0, 0],
  board: [[null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]],
  winningPoints: [],
  AI: false,
  depth: 6,
};

// Start the server
app.listen(8080, () => {
  console.log('Server started 8080');
});

app.get('/gameState', (req, res) => {
  // Return the current server gameState
  res.send(gameState);
});

app.post('/initGameBoard/:rows/:cols', (req, res) => {
  // Create new gameState using given parameters
  gameState.board = createEmptyBoardState(req.params.rows, req.params.cols);
  // Reset gameState variables
  gameState.inputValid = true;
  gameState.turnCount = 0;
  gameState.winningPoints = [];
  // Send the updated gameState back to the client
  res.send(gameState);
});

app.post('/initGameLength/:desiredLength', (req, res) => {
  // Update gameState using given parameter
  gameState.lengthNeeded = parseInt(req.params.desiredLength, 10);
  // Send the updated gameState back to the client
  res.send(gameState);
});

app.post('/toggleAI', (req, res) => {
  // Update gameState to toggle the AI
  gameState.AI = toggleAI(gameState.AI);
  // Send the updated gameState back to the client
  res.send(gameState);
});

app.post('/takeTurn/:player/:row/:col', (req, res) => {
  // Check its the right players turn and that input is currently allowed
  if (req.params.player === gameState.player && gameState.inputValid === true) {
    // Convert parameters to cooridinates
    const x = parseInt(req.params.row, 10);
    const y = parseInt(req.params.col, 10);
    // Check the (x,y) square is empty
    if (gameState.board[x][y] === null) {
      // Set square equal to player and switch turns
      gameState.board[x][y] = req.params.player;
      gameState.player = switchPlayer(gameState.player);
      // Find winning points and add to gameState
      gameState.winningPoints = checkWinner(x, y, gameState.lengthNeeded, gameState.board);
      // If there are any winning points update scores and prevent furthur input
      if (gameState.winningPoints.length > 0) {
        gameState.inputValid = false;
        gameState.winCounter = updateScore(gameState.player, gameState.winCounter);
      } else {
        gameState.turnCount += 1;
      }
      if (gameState.AI) {
        let maximisingPlayer = true;
        if (gameState.player === 'red') {
          maximisingPlayer = false;
        }
        const move = minimaxNextMove(gameState.board,
          gameState.depth,
          maximisingPlayer,
          gameState.lengthNeeded);
        gameState.board[move[0]][move[1]] = gameState.player;
        gameState.player = switchPlayer(gameState.player);
        // Find winning points and add to gameState
        gameState.winningPoints = checkWinner(move[0],
          move[1],
          gameState.lengthNeeded,
          gameState.board);
        // If there are any winning points update scores and prevent furthur input
        if (gameState.winningPoints.length > 0) {
          gameState.inputValid = false;
          gameState.winCounter = updateScore(gameState.player, gameState.winCounter);
        } else {
          gameState.turnCount += 1;
        }
      }
      // Send the updated gameState back to the client
      res.send(gameState);
    }
  }
});

function toggleAiPost() {
  // Send post request to toggle AI setting
  $.ajax({
    url: 'http://localhost:8080/toggleAI',
    type: 'POST',
    crossDomain: true,
    success(data) {
      // Bring client up to data with server
      gameState = data;
      // Update client side UI
      console.log('AI clicked');
      console.log(gameState);
    },
  });
}

app.post('/toggleAI', (req, res) => {
  // Update gameState to toggle the AI
  gameState.AI = toggleAI(gameState.AI);
  // Send the updated gameState back to the client
  res.send(gameState);
});