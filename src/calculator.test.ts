import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from './calculator.ts';
test('respects precedence and parentheses', () => { assert.equal(calculate('2+3×4'),14); assert.equal(calculate('(2+3)×4'),20); });
test('handles decimals, percentages, negatives and scientific results', () => { assert.equal(calculate('0.1+0.2'),.3); assert.equal(calculate('200×10%'),20); assert.equal(calculate('(−5)+2'),-3); assert.equal(calculate('1e+12+1'),1000000000000); });
test('rejects incomplete expressions and division by zero', () => { for(const expression of ['2÷0','(2+3','2+','alert(1)','2..3']) assert.throws(() => calculate(expression)); });
