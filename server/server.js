/* eslint-disable no-console */
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
// const FileSystem = require('mock-fs/lib/filesystem');
const {
  createEmptyBoardState,
  switchPlayer,
  checkWinner,
  updateScore,
  saveState,
  loadState,
  resetSaveState,
  searchStates,
  newState,
  createUser,
  randomName,
  searchUsers,
  loadUser,
  saveUser,
} = require('./main.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('client'));

// Start the server
app.listen(3008, () => {
  console.log('Server started 3008');
});

app.get('/gameState/:gameId', async (req, res) => {
  let state = {};
  // Return the current server gameState
  if (!await searchStates(req.params.gameId)) {
    newState(req.params.gameId);
  }
  state = await loadState(req.params.gameId);
  res.send(state);
});

app.post('/resetSave/:gameId', (req, res) => {
  const resetState = {
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
    users: ['', ''],
  };
  resetSaveState(resetState, req.params.gameId);
  res.send(resetState);
});

app.post('/loadSave/:gameId/:userId', async (req, res) => {
  const state = await loadState(req.params.gameId);
  if (state.users[0] === req.params.userId || state.users[1] === req.params.userId) {
    res.send(state);
  }
  if (state.users[1] === '') {
    state.users[1] = req.params.userId;
    await saveState(state, req.params.gameId);
    res.send(state);
  } else {
    res.send(401, 'Game full');
  }
});

app.post('/newGame/:rows/:cols/:length/:gameId/:userId', async (req, res) => {
  const state = {
    turnCount: 0,
    player: 'yellow',
    inputValid: true,
    lengthNeeded: req.params.length,
    winCounter: [0, 0],
    board: await createEmptyBoardState(req.params.rows, req.params.cols),
    winningPoints: [],
    users: [req.params.userId, ''],
  };
  const user = await loadUser(req.params.userId);
  user.games.push(req.params.gameId);
  await saveUser(req.params.userId, user);
  console.log(state);
  saveState(state, req.params.gameId);
  // Send the updated gameState back to the client
  res.send(state);
});

app.post('/initGameBoard/:rows/:cols/:gameId/:userId', async (req, res) => {
  const state = await loadState(req.params.gameId);
  // Create new gameState using given parameters
  state.board = createEmptyBoardState(req.params.rows, req.params.cols);
  // Reset gameState variables
  state.inputValid = true;
  state.turnCount = 0;
  state.winningPoints = [];
  saveState(state, req.params.gameId);
  // Send the updated gameState back to the client
  res.send(state);
});

app.post('/initGameLength/:desiredLength/:gameId', async (req, res) => {
  const state = await loadState(req.params.gameId);
  // Update gameState using given parameter
  state.lengthNeeded = parseInt(req.params.desiredLength, 10);
  // Send the updated gameState back to the client
  res.send(state);
});

app.post('/takeTurn/:player/:row/:col/:gameId', async (req, res) => {
  const state = await loadState(req.params.gameId);
  // Check its the right players turn and that input is currently allowed
  if (req.params.player === state.player && state.inputValid === true) {
    // Convert parameters to cooridinates
    const x = parseInt(req.params.row, 10);
    const y = parseInt(req.params.col, 10);
    // Check the (x,y) square is empty
    if (state.board[x][y] === null) {
      // Set square equal to player and switch turns
      state.board[x][y] = req.params.player;
      state.player = switchPlayer(state.player);
      // Find winning points and add to gameState
      state.winningPoints = checkWinner(x, y, state.lengthNeeded, state.board);
      // If there are any winning points update scores and prevent furthur input
      if (state.winningPoints.length > 0) {
        state.inputValid = false;
        state.winCounter = updateScore(state.player, state.winCounter);
      } else {
        state.turnCount += 1;
      }
      await saveState(state, req.params.gameId);
      // Send the updated gameState back to the client
      res.send(state);
    }
  }
});

app.post('/createUser/:username/:password', async (req, res) => {
  const userId = await createUser(req.params.username, req.params.password);
  res.send(userId);
});

app.post('/loginUser/:username/:password', async (req, res) => {
  if (!await searchUsers(req.params.username)) {
    createUser(req.params.username, req.params.password);
  }
  const user = await loadUser(req.params.username);
  if (user.password !== req.params.password) {
    res.send(401, 'Incorrect password');
  }
  res.send([user.username, user.games]);
});

app.post('/guestUser', async (req, res) => {
  const name = await randomName();
  createUser(name, 'guest');
  res.send(name);
});

if (typeof module !== 'undefined') {
  module.exports = {
    saveState,
    loadState,
    resetSaveState,
  };
}
