/* eslint-disable no-undef */
const each = require('jest-each').default;
const {
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
} = require('../server/AI.js');

describe('checkRows', () => {
  const state = [[null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, 'red', 'red', 'red', 'red', null]];
  each([
    [['redredredred', 20], 20],
    [['redredredred', 40], 40],
    [['redrednullred', 20], 0],
  ]).it("when the input is '%s'", async (input, expected) => {
    expect(await checkRows(state, input[0], input[1])).toBe(expected);
  });
});

describe('checkCols', () => {
  const state = [[null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, 'red', null, null, null, null],
    [null, null, 'red', null, null, null, null],
    [null, null, 'red', null, null, null, null],
    [null, null, 'red', null, null, null, null]];
  each([
    [['redredredred', 20], 20],
    [['redredredred', 40], 40],
    [['redrednullred', 20], 0],
  ]).it("when the input is '%s'", async (input, expected) => {
    expect(await checkCols(state, input[0], input[1])).toBe(expected);
  });
});

describe('checkAntiDiag', () => {
  const state = [[null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, 'red', null],
    [null, null, null, null, 'red', null, null],
    [null, null, null, 'red', null, null, null],
    [null, null, 'red', null, null, null, null]];
  each([
    [['redredredred', 20], 20],
    [['redredredred', 40], 40],
    [['redrednullred', 20], 0],
  ]).it("when the input is '%s'", async (input, expected) => {
    expect(await checkAntiDiag(state, input[0], input[1])).toBe(expected);
  });
});

describe('checkLeadingDiag', () => {
  const state = [[null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, 'red', null, null, null, null, null],
    [null, null, 'red', null, null, null, null],
    [null, null, null, 'red', null, null, null],
    [null, null, null, null, 'red', null, null]];
  each([
    [['redredredred', 20], 20],
    [['redredredred', 40], 40],
    [['redrednullred', 20], 0],
  ]).it("when the input is '%s'", async (input, expected) => {
    expect(await checkLeadingDiag(state, input[0], input[1])).toBe(expected);
  });
});
