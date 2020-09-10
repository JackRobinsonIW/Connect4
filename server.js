/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const {
  createEmptyBoardState, switchPlayer, checkWinner, updateScore,
} = require('./main');

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(8080, () => {
  console.log('Server started 8080');
});

app.get('/gameState', (req, res) => {
  res.send(gameState);
});

app.post('/initGameBoard/:rows/:cols', (req, res) => {
  gameState.board = createEmptyBoardState(req.params.rows, req.params.cols);
  gameState.inputValid = true;
  gameState.turnCount = 0;
  gameState.winningPoints = [];
  res.send(gameState);
});

app.post('/initGameLength/:desiredLength', (req, res) => {
  gameState.lengthNeeded = parseInt(req.params.desiredLength, 10);
  res.send(gameState);
});

app.post('/takeTurn/:player/:row/:col', (req, res) => {
  if (req.params.player === gameState.player && gameState.inputValid === true) {
    const x = parseInt(req.params.row, 10);
    const y = parseInt(req.params.col, 10);
    if (gameState.board[x][y] === null) {
      gameState.board[x][y] = req.params.player;
      gameState.player = switchPlayer(gameState.player);
      gameState.winningPoints = checkWinner(x, y, gameState.lengthNeeded, gameState.board);
      if (gameState.winningPoints.length > 0) {
        gameState.inputValid = false;
        gameState.winCounter = updateScore(gameState.player, gameState.winCounter);
      } else {
        gameState.turnCount += 1;
      }
      res.send(gameState);
    }
  }
});
