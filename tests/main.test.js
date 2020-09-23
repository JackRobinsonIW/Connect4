/* eslint-disable no-undef */
const each = require('jest-each').default;
const mock = require('mock-fs');
const fs = require('fs').promises;
const request = require('supertest');
const {
  createEmptyBoardState,
  switchPlayer,
  checkWinner,
  updateScore,
  columnEmptySpace,
  saveState,
  loadState,
  resetSaveState,
  searchStates,
  randomName,
  searchUsers,
} = require('../server/main.js');

const games = {
  gameId: null,
  turnCount: 3,
  player: 'red',
  inputValid: true,
  lengthNeeded: 4,
  winCounter: [0, 0],
  board: [[null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, 'yellow', null, null, null],
    [null, null, 'red', 'yellow', null, null, null]],
  winningPoints: [],
};

const users = {
  username: 'Alice', password: 'Malice', userId: 'be2e7611-1934-41fe-bde2-1bf90ef60bd7', games: [],
};

const randomWords = ['abri', 'abris', 'abroad', 'abrupt', 'abs', 'abseil', 'absent', 'absorb', 'absurd', 'abulia'];

beforeEach(() => {
  mock({
    './data/gameStates': {
      '101.json': JSON.stringify(games),
    },
    './data/userData': {
      'ALice.json': JSON.stringify(users),
    },
    './server': {
      'random-words.json': JSON.stringify(randomWords),
    },
  });

  jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);
});

afterEach(() => {
  mock.restore();
});

test('loadState', async () => {
  expect(await loadState(101)).toStrictEqual(games);
});

test('searchStates', async () => {
  expect(await searchStates(101)).toBe(true);
});

test('searchUsers', async () => {
  expect(await searchStates(101)).toBe(true);
});

describe('searchUsers', () => {
  each([
    ['Alice', true],
    ['Bob', false],
  ]).it("when the input is '%s'", async (input, expected) => {
    expect(await searchUsers(input)).toBe(expected);
  });
});

test('saveState', async () => {
  jest.spyOn(fs, 'writeFile');
  const state = {
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
  const gameId = test;
  saveState(state, gameId);
  expect(fs).toHaveBeenCalled();
});

test('randomName', async () => {
  expect(await randomName()).toBe('abrisabroad');
});

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
      [0, 1],
    ],
    [
      ['red', [0, 0]],
      [1, 0],
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
