/* eslint-disable no-console */

const {
  columnEmptySpace,
} = require('./main.js');

function checkRows(boardstate, string, score) {
  for (let i = 0; i < boardstate.length; i += 1) {
    let row = '';
    for (let j = 0; j < boardstate[0].length; j += 1) {
      row += boardstate[i][j];
    }
    if (row.includes(string)) {
      return score;
    }
  }
  return 0;
}

function checkCols(boardstate, string, score) {
  for (let j = 0; j < boardstate[0].length; j += 1) {
    let col = '';
    for (let i = 0; i < boardstate.length; i += 1) {
      col += boardstate[i][j];
    }
    if (col.includes(string)) {
      return score;
    }
  }
  return 0;
}

function checkLeadingDiag(boardstate, string, score) {
  for (let j = 0; j < boardstate[0].length; j += 1) {
    let diag = '';
    let x = 0;
    let y = j;
    for (let i = 0; i < Math.min(boardstate.length, boardstate[0].length - j); i += 1) {
      diag += boardstate[x][y];
      x += 1;
      y += 1;
    }
    if (diag.includes(string)) {
      return score;
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
    if (diag.includes(string)) {
      return score;
    }
  }
  return 0;
}

function checkAntiDiag(boardstate, string, score) {
  for (let j = 0; j < boardstate[0].length; j += 1) {
    let diag = '';
    let x = 0;
    let y = j;
    for (let i = 0; i < Math.min(boardstate.length, j + 1); i += 1) {
      diag += boardstate[x][y];
      x += 1;
      y -= 1;
    }
    if (diag.includes(string)) {
      return score;
    }
  }
  for (let i = 1; i < boardstate.length; i += 1) {
    let diag = '';
    let x = i;
    let y = boardstate[0].length - 1;
    for (let j = 0; j < boardstate.length - i; j += 1) {
      diag += boardstate[x][y];
      x += 1;
      y -= 1;
    }
    if (diag.includes(string)) {
      return score;
    }
  }
  return 0;
}

function checkStateForString(boardstate, string, score) {
  let scoreSum = 0;
  scoreSum += checkRows(boardstate, string, score);
  scoreSum += checkCols(boardstate, string, score);
  scoreSum += checkLeadingDiag(boardstate, string, score);
  scoreSum += checkAntiDiag(boardstate, string, score);
  return scoreSum;
}

function winningStrings(lengthNeeded) {
  let yellowStr = '';
  let redStr = '';
  for (let i = 0; i < lengthNeeded; i += 1) {
    yellowStr += 'yellow';
    redStr += 'red';
  }
  return [yellowStr, redStr];
}

function ofByOneStrings(lengthNeeded) {
  const yellowStrings = [];
  const redStrings = [];
  for (let i = 0; i < lengthNeeded; i += 1) {
    let yellowStr = '';
    let redStr = '';
    for (let j = 0; j < lengthNeeded; j += 1) {
      if (i === j) {
        yellowStr += 'null';
        redStr += 'null';
      } else {
        yellowStr += 'yellow';
        redStr += 'red';
      }
    }
    yellowStrings.push(yellowStr);
    redStrings.push(redStr);
  }
  return [yellowStrings, redStrings];
}

function checkStateForWinner(boardstate, lengthNeeded) {
  const winninerStringArray = winningStrings(lengthNeeded);
  return checkStateForString(boardstate, winninerStringArray[0], 100)
  + checkStateForString(boardstate, winninerStringArray[1], -100);
}

function staticEvaluation(boardstate, lengthNeeded) {
  let winningScore = checkStateForWinner(boardstate, lengthNeeded);
  if (Math.abs(winningScore) === 100) {
    return winningScore;
  }
  const strings = ofByOneStrings(lengthNeeded);
  strings[0].forEach((element) => {
    winningScore += checkStateForString(boardstate, element, 20);
  });
  strings[1].forEach((element) => {
    winningScore += checkStateForString(boardstate, element, -20);
  });
  return winningScore;
}

function findMoves(boardstate) {
  const moves = [];
  for (let j = 0; j < boardstate[0].length; j += 1) {
    const i = columnEmptySpace(j, boardstate);
    if (i !== null) {
      moves.push([i, j]);
    }
  }
  return moves;
}

function generateChildren(boardstate, maximisingPlayer) {
  const children = [];
  let player = '';
  if (maximisingPlayer) {
    player = 'yellow';
  } else {
    player = 'red';
  }
  const moves = findMoves(boardstate);
  for (let i = 0; i < moves.length; i += 1) {
    const childState = JSON.parse(JSON.stringify(boardstate));
    childState[moves[i][0]][moves[i][1]] = player;
    children.push(childState);
  }
  return children;
}

function minimax(boardstate, depth, alpha, beta, maximisingPlayer, requiredLength) {
  const gameOver = checkStateForWinner(boardstate, requiredLength);
  if (depth === 0 || gameOver === 100) {
    if (maximisingPlayer) {
      return staticEvaluation(boardstate, requiredLength) + depth;
    }
    return staticEvaluation(boardstate, requiredLength) - depth;
  }

  if (maximisingPlayer) {
    let maxEval = -Infinity;
    const children = generateChildren(boardstate, true);
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
  const children = generateChildren(boardstate, false);
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

function minimaxNextMove(boardstate, depth, maximisingPlayer, requiredLength, turn) {
  if (turn === 0 || turn === 1) {
    const col = Math.floor(boardstate[0].length / 2);
    const row = columnEmptySpace(col, boardstate);
    return [row, col];
  }
  const moves = findMoves(boardstate);
  const children = generateChildren(boardstate, maximisingPlayer);
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

const state = [[null, null, null, null, null, null, null],
[null, null, null, null, null, null, null],
[null, null, null, null, null, null, null],
[null, null, null, null, null, null, null],
[null, null, null, null, null, null, null],
[null, null, null, null, null, null, null]];

const string = 'redredredred';

const score = 10;

const result = checkLeadingDiag(state, string, score);

console.log(result);

if (typeof module !== 'undefined') {
  module.exports = {
    minimaxNextMove,
    minimax,
    generateChildren,
    findMoves,
    staticEvaluation,
    checkStateForWinner,
    ofByOneStrings,
    winningStrings,
    checkStateForString,
    checkAntiDiag,
    checkLeadingDiag,
    checkCols,
    checkRows,
  };
}
