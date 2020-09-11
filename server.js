/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const {
  createEmptyBoardState, switchPlayer, checkWinner, updateScore,
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
      // Send the updated gameState back to the client
      res.send(gameState);
    }
  }
});
