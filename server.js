const express = require('express');
const cors = require('cors');
const { createEmptyBoardState } = require('./main');

const app = express();
app.use(cors());
app.use(express.json());

const winCounter = [0, 0];
const player = 'yellow';
let lengthNeeded = 4;
const inputValid = true;
const turnCount = 0;
let board = [[null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null]];

app.listen(8080, () => {
  console.log('Server started 8080');
});

app.get('/gameState', (req, res) => {
  res.send(
    {
      'scoreArray': winCounter,
      'playerTurn': player,
      'requiredLength': lengthNeeded,
      'gameNotOver': inputValid,
      'numberOfTurns': turnCount,
      'boardArray': board,
    },
  );
});

app.post('/initGameBoard/:rows/:cols', (req, res) => {
  board = createEmptyBoardState(req.params.rows, req.params.cols);
  res.send(
    {
      'boardArray': board,
    },
  );
});

app.post('/initGameLength/:desiredLength', (req, res) => {
  lengthNeeded = parseInt(req.params.desiredLength, 10);
  res.send(
    {
      'requiredLength': lengthNeeded,
    },
  );
});

app.post('/takeTurn/:playerString/:row/:col', (req, res) => {
  board[parseInt(req.params.row, 10)][parseInt(req.params.col, 10)] = req.params.playerString;
  res.send(
    {
      'scoreArray': winCounter,
      'playerTurn': player,
      'requiredLength': lengthNeeded,
      'gameNotOver': inputValid,
      'numberOfTurns': turnCount,
      'boardArray': board,
    },
  );
});

