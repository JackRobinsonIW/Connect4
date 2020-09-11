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

function checkAdjacent(direction, x, y, winningPoints, boardState) {
  // Define x and y changes for a given direction with 0 = UP, 1 = UP-RIGHT, 2 = RIGHT, etc
  const iValues = [-1, -1, 0, 1, 1, 1, 0, -1];
  const jValues = [0, 1, 1, 1, 0, -1, -1, -1];

  // Calculate next square
  const newX = x + iValues[direction];
  const newY = y + jValues[direction];

  // Check out of bounds
  if (newX >= boardState.length || newX < 0 || newY >= boardState[x].length || newY < 0) {
    return winningPoints;
  }

  // Check if adjacent square is same value and if so call recursively
  if (boardState[x][y] === boardState[newX][newY] && boardState[newX][newY] !== null) {
    if (!winningPoints.includes([newX, newY])) {
      winningPoints.push([newX, newY]);
    }
    return checkAdjacent(direction, newX, newY, winningPoints, boardState);
  }

  // If the adjacent square exists but is a different colour return the array
  return winningPoints;
}

function checkWinner(x, y, lengthNeeded, boardState) {
  // Create empty array
  const winningPoints = [];

  // Check row, col and each diagonal
  for (let i = 0; i < 4; i += 1) {
    // Checks opposing directions and joins the arrays they return
    const checkingPoints = checkAdjacent(i + 4, x, y, [], boardState)
      .concat(checkAdjacent(i, x, y, [], boardState));
    // If a winning arrangement is found add it to the winningPoints array
    if (checkingPoints.length >= (lengthNeeded - 1)) {
      checkingPoints.forEach((element) => {
        winningPoints.push(element);
      });
      if (!winningPoints.includes([x, y])) {
        winningPoints.push([x, y]);
      }
    }
  }
  return winningPoints;
}

function updateScore(player, winCounter) {
  if (player === 'yellow') {
    return [winCounter[0] + 1, winCounter[1]];
  }
  return [winCounter[0], winCounter[1] + 1];
}

function switchPlayer(player) {
  return (player === 'yellow' ? 'red' : 'yellow');
}

function createEmptyBoardState(rows, columns) {
  // Create empty array
  const boardState = [];
  for (let i = 0; i < rows; i += 1) {
    // Create row and fill it with null
    boardState.push([]);
    for (let j = 0; j < columns; j += 1) {
      boardState[i].push(null);
    }
  }
  return boardState;
}

if (typeof module !== 'undefined') {
  module.exports = {
    columnEmptySpace,
    checkAdjacent,
    checkWinner,
    updateScore,
    switchPlayer,
    createEmptyBoardState,
  };
}
