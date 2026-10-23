import { useEffect, useReducer, useState } from 'react';
import { calculate } from '../calculator';
export type Entry = { expression: string; result: string };
export type State = {
  expression: string;
  result: string;
  finished: boolean;
  error: string;
  history: Entry[];
};
const initial: State = {
  expression: '',
  result: '0',
  finished: false,
  error: '',
  history: [],
};
function reducer(state: State, key: string): State {
  if (key === 'clear-history') return { ...state, history: [] };
  if (key === 'AC') return { ...initial, history: state.history };
  if (key.startsWith('recall:'))
    return { ...state, expression: key.slice(7), finished: false, error: '' };
  if (key === '=') {
    if (!state.expression || state.finished) return state;
    try {
      const result = String(calculate(state.expression));
      return {
        ...state,
        result,
        finished: true,
        error: '',
        history: [
          { expression: state.expression, result },
          ...state.history,
        ].slice(0, 30),
      };
    } catch (error) {
      return { ...state, error: (error as Error).message };
    }
  }
  let expression = state.finished
    ? /^[+−×÷%]$/.test(key)
      ? state.result
      : ''
    : state.expression;
  if (key === 'backspace')
    expression = state.finished
      ? state.result.slice(0, -1)
      : expression.slice(0, -1);
  else if (key === '±') {
    const match = expression.match(/(\d*\.?\d+)$/);
    expression = match
      ? expression.slice(0, -match[0].length) + `(−${match[0]})`
      : expression;
  } else if (key === '()') {
    const open = (expression.match(/\(/g) ?? []).length;
    const close = (expression.match(/\)/g) ?? []).length;
    expression +=
      open > close && /[\d)%]$/.test(expression)
        ? ')'
        : /[\d)%]$/.test(expression)
          ? '×('
          : '(';
  } else {
    if (key === '.' && /\.[\d]*$/.test(expression)) return state;
    if (/^[+−×÷]$/.test(key) && /[+−×÷]$/.test(expression))
      expression = expression.slice(0, -1);
    expression += key;
  }
  return {
    ...state,
    expression: expression.slice(0, 160),
    finished: false,
    error: '',
  };
}

export function useCalculator(shortcutsEnabled: boolean) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [sound, setSound] = useState(false);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (
        !shortcutsEnabled ||
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable ||
            target.closest(
              'input, textarea, select, [role="combobox"], [role="listbox"], [role="dialog"]',
            ) ||
            (target.closest('button') && ['Enter', ' '].includes(event.key))))
      )
        return;
      const shortcuts: Record<string, string> = {
        Enter: '=',
        '=': '=',
        Escape: 'AC',
        Backspace: 'backspace',
        '*': '×',
        '/': '÷',
        '-': '−',
      };
      if (/^[\d.+()%]$/.test(event.key) || shortcuts[event.key]) {
        event.preventDefault();
        dispatch(shortcuts[event.key] ?? event.key);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcutsEnabled]);
  function press(key: string) {
    dispatch(key);
    if (sound) {
      try {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = key === '=' ? 660 : 280;
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.08);
        oscillator.onended = () => {
          void ctx.close();
        };
      } catch {
        /* Sound is optional when audio is unavailable. */
      }
    }
  }

  return {
    state,
    dispatch,
    press,
    sound,
    toggleSound: () => setSound((value) => !value),
  };
}
