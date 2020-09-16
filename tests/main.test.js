/* eslint-disable no-undef */
const each = require('jest-each').default;
const {
  columnEmptySpace, createEmptyBoardState, switchPlayer, updateScore, checkWinner,
} = require('../server/main.js');

describe('createEmptyBoardState', () => {
  each([
    [
      [6, 7],
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
    ],
    [
      [1, 0],
      [[]],
    ],
    [
      [0, 0],
      [],
    ],
  ]).it("when the input is '%s'", (input, expected) => {
    expect(createEmptyBoardState(input[0], input[1])).toStrictEqual(expected);
  });
});

describe('columnEmpty', () => {
  each([
    [
      [0,
        [
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
        ],
      ],
      5,
    ],
    [
      [1,
        [
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, 'yellow', null, null, null, null, null],
        ],
      ],
      4,
    ],
    [
      [2,
        [
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
        ],
      ],
      null,
    ],
  ]).it("when the input is '%s'", (input, expected) => {
    expect(columnEmptySpace(input[0], input[1])).toStrictEqual(expected);
  });
});

describe('switchPlayer', () => {
  each([
    [
      'yellow',
      'red',
    ],
    [
      'red',
      'yellow',
    ],
  ]).it("when the input is '%s'", (input, expected) => {
    expect(switchPlayer(input)).toStrictEqual(expected);
  });
});

describe('updateScore', () => {
  each([
    [
      ['yellow', [0, 0]],
      [1, 0],
    ],
    [
      ['red', [0, 0]],
      [0, 1],
    ],
  ]).it("when the input is '%s'", (input, expected) => {
    expect(updateScore(input[0], input[1])).toStrictEqual(expected);
  });
});

describe('checkWinner', () => {
  each([
    [
      [2, 2, 4,
        [
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
        ],
      ],
      [[3, 2], [4, 2], [5, 2], [2, 2]],
    ],
    [
      [5, 1, 4,
        [
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          ['yellow', 'yellow', 'yellow', 'yellow', null, null, null],
        ],
      ],
      [[5, 0], [5, 2], [5, 3], [5, 1]],
    ],
    [
      [2, 3, 5,
        [
          [null, null, null, null, null, null, null],
          [null, null, null, null, 'yellow', null, null],
          [null, null, null, 'yellow', null, null, null],
          [null, null, 'yellow', null, null, null, null],
          [null, 'yellow', null, null, null, null, null],
          ['yellow', null, null, null, null, null, null],
        ],
      ],
      [[3, 2], [4, 1], [5, 0], [1, 4], [2, 3]],
    ],
    [
      [5, 2, 3,
        [
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          ['yellow', null, null, null, null, null, null],
          [null, 'yellow', null, null, null, null, null],
          [null, null, 'yellow', null, null, null, null],
        ],
      ],
      [[4, 1], [3, 0], [5, 2]],
    ],
    [
      [4, 2, 4,
        [
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, 'yellow', 'yellow', 'yellow', null, null, null],
          [null, 'yellow', 'yellow', 'yellow', null, null, null],
          [null, 'yellow', 'yellow', 'yellow', null, null, null],
        ],
      ],
      [],
    ],

  ]).it("when the input is '%s'", (input, expected) => {
    expect(checkWinner(input[0], input[1], input[2], input[3])).toStrictEqual(expected);
  });
});
