const each = require('jest-each').default;
const {
  columnEmptySpace, createEmptyBoardState, switchPlayer, updateScore, checkWinner,
} = require('./main-test');

test('columnEmptySpace 0,0 empty', () => {
  // columnEmptySpace
  expected_output = 5;

  // Act
  board = createEmptyBoardState(6, 7);
  actual_output = columnEmptySpace(board, 0);

  // Assert
  expect(actual_output).toBe(expected_output);
});
