// Recursive descent keeps expression evaluation independent of executable JavaScript.
export function calculate(expression: string): number {
  const tokens = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').match(/(?:\d*\.?\d+(?:e[+-]?\d+)?)|[()+\-*/%]/gi) ?? [];
  if (tokens.join('') !== expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s/g, '')) throw new Error('Invalid expression');
  let i = 0;
  function primary(): number {
    let value: number;
    if (tokens[i] === '+' || tokens[i] === '-') { const sign = tokens[i++]; value = primary() * (sign === '-' ? -1 : 1); }
    else if (tokens[i] === '(') { i++; value = sum(); if (tokens[i++] !== ')') throw new Error('Close the parentheses'); }
    else { const token = tokens[i++]; if (!token || !/^(?:\d*\.?\d+(?:e[+-]?\d+)?)$/i.test(token)) throw new Error('Complete the expression'); value = Number(token); }
    while (tokens[i] === '%') { i++; value /= 100; }
    return value;
  }
  function product(): number { let value = primary(); while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++]; const right = primary(); if (op === '/' && right === 0) throw new Error('Cannot divide by zero'); value = op === '*' ? value * right : value / right; } return value; }
  function sum(): number { let value = product(); while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++]; const right = product(); value = op === '+' ? value + right : value - right; } return value; }
  const result = sum();
  if (i !== tokens.length) throw new Error('Check your expression');
  if (!Number.isFinite(result)) throw new Error('Result is out of range');
  return Number(result.toPrecision(12));
}
