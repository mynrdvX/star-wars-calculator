import React, { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, AudioLines, Check, ChevronDown, CircleHelp, Copy, Delete, History, Keyboard, Orbit, Radio, Shield, Sparkles, Trash2, X } from 'lucide-react';
import { calculate } from './calculator';
import './styles.css';

type Entry = { expression: string; result: string };
type State = { expression: string; result: string; finished: boolean; error: string; history: Entry[] };
const initial: State = { expression: '', result: '0', finished: false, error: '', history: [] };
function reducer(state: State, key: string): State {
  if (key === 'clear-history') return { ...state, history: [] };
  if (key === 'AC') return { ...initial, history: state.history };
  if (key.startsWith('recall:')) return { ...state, expression: key.slice(7), finished: false, error: '' };
  if (key === '=') {
    if (!state.expression || state.finished) return state;
    try { const result = String(calculate(state.expression)); return { ...state, result, finished: true, error: '', history: [{ expression: state.expression, result }, ...state.history].slice(0, 30) }; }
    catch (error) { return { ...state, error: (error as Error).message }; }
  }
  let expression = state.finished ? (/^[+−×÷%]$/.test(key) ? state.result : '') : state.expression;
  if (key === 'backspace') expression = state.finished ? state.result.slice(0, -1) : expression.slice(0, -1);
  else if (key === '±') { const match = expression.match(/(\d*\.?\d+)$/); expression = match ? expression.slice(0, -match[0].length) + `(−${match[0]})` : expression; }
  else if (key === '()') { const open = (expression.match(/\(/g) ?? []).length; const close = (expression.match(/\)/g) ?? []).length; expression += open > close && /[\d)%]$/.test(expression) ? ')' : /[\d)%]$/.test(expression) ? '×(' : '('; }
  else { if (key === '.' && /\.[\d]*$/.test(expression)) return state; if (/^[+−×÷]$/.test(key) && /[+−×÷]$/.test(expression)) expression = expression.slice(0, -1); expression += key; }
  return { ...state, expression: expression.slice(0, 160), finished: false, error: '' };
}
const keys = ['AC', '()', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '±', '0', '.', '='];
function App() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [side, setSide] = useState('Balance');
  const [help, setHelp] = useState(false);
  const [sound, setSound] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { function onKey(e: KeyboardEvent) { if (e.ctrlKey || e.metaKey || e.altKey || (e.target instanceof HTMLElement && (e.target.tagName === 'SELECT' || (e.target.tagName === 'BUTTON' && e.key === 'Enter')))) return; const map: Record<string, string> = { Enter: '=', '=': '=', Escape: 'AC', Backspace: 'backspace', '*': '×', '/': '÷', '-': '−' }; if (/^[\d.+()%]$/.test(e.key) || map[e.key]) { e.preventDefault(); dispatch(map[e.key] ?? e.key); } } window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  function press(key: string) { dispatch(key); if (sound) { try { const ctx = new AudioContext(); const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.connect(gain); gain.connect(ctx.destination); oscillator.frequency.value = key === '=' ? 660 : 280; gain.gain.setValueAtTime(0.025, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07); oscillator.start(); oscillator.stop(ctx.currentTime + 0.08); oscillator.onended = () => { void ctx.close(); }; } catch { /* Sound is optional when audio is unavailable. */ } } }
  async function copy() { try { await navigator.clipboard.writeText(state.finished ? state.result : state.expression || '0'); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); } }
  return <div className="app" data-side={side}>
    <div className="stars" aria-hidden="true"/>
    <header><a className="brand" href="./"><Orbit size={29}/><span>HOLO<span className="brand-light">CALC</span><small>A GALAXY OF POSSIBILITIES</small></span></a><div className="header-right"><span className="online"><i/> SYSTEM ONLINE</span><button className="icon-button help-button" aria-label="Keyboard shortcuts" onClick={() => setHelp(true)}><CircleHelp size={20}/></button><span className="version">V.01</span></div></header>
    <main><section className="intro"><div className="eyebrow"><span/> YOUR PERSONAL NAVICOMPUTER</div><h1>Calculate your<br/><em>destiny.</em></h1><p>From simple sums to hyperspace coordinates.<br/>Every great mission starts with a calculation.</p><div className="sector"><Radio size={14}/> CORUSCANT SECTOR <span> // </span> 0.0.0.1</div></section>
    <div className="workspace"><section className="calculator" aria-label="Calculator"><div className="panel-heading"><span><Orbit size={16}/> NAVICOMPUTER</span><span className="tiny muted">CORE / 01 <i className="status-dot"/></span></div><div className="mode-row"><span className="mode"><span/> STANDARD</span><label className="side-select"><Shield size={13}/><select aria-label="Choose Force theme" value={side} onChange={e => setSide(e.target.value)}><option>Balance</option><option>Jedi</option><option>Sith</option></select><ChevronDown size={12}/></label></div><div className="display"><div className="display-top"><span className="tiny">INPUT SEQUENCE</span><button aria-label={copied ? 'Copied' : 'Copy display'} className="icon-button" onClick={copy}>{copied ? <Check size={15}/> : <Copy size={15}/>}</button></div><div className="expression">{state.finished ? state.expression + ' =' : '\u00a0'}</div><output aria-live="polite" className={(state.finished ? state.result : state.expression).length > 12 ? 'small-result' : ''}>{state.finished ? Number(state.result).toLocaleString('en-US', { maximumSignificantDigits: 12 }) : state.expression || '0'}</output><div className={'display-bottom' + (state.error ? ' error' : '')}><span>{state.error || (state.finished ? 'CALCULATION COMPLETE' : 'AWAITING YOUR COMMAND')}</span><button className="icon-button" aria-label="Delete last character" onClick={() => press('backspace')}><Delete size={18}/></button></div></div><div className="keypad">{keys.map(key => <button key={key} onClick={() => press(key)} className={'key ' + (key === '=' ? 'equals' : /[÷×−+]/.test(key) ? 'operator' : ['AC','()','%'].includes(key) ? 'utility' : '')} aria-label={key === '±' ? 'Change sign' : key === 'AC' ? 'Clear all' : key === '()' ? 'Parentheses' : key}>{key}</button>)}</div><div className="calculator-footer"><span><Keyboard size={14}/> Keyboard ready</span><button onClick={() => setSound(!sound)} aria-pressed={sound}><AudioLines size={14}/> Sound {sound ? 'on' : 'off'}</button></div></section>
    <aside className="history-panel"><div className="panel-heading"><span><History size={16}/> FLIGHT LOG</span><button className="icon-button" aria-label="Clear calculation history" disabled={!state.history.length} onClick={() => dispatch('clear-history')}><Trash2 size={15}/></button></div><div className="history-title">Your calculations, archived.<span>{String(state.history.length).padStart(2,'0')} ENTRIES</span></div><div className="history-content">{state.history.length ? state.history.map((entry, i) => <button className="history-entry" key={i} onClick={() => dispatch('recall:' + entry.result)} aria-label={`Reuse result ${entry.result}`}><span>{entry.expression} =</span><strong>{entry.result}<ArrowUpRight size={14}/></strong></button>) : <div className="empty-history"><div className="history-orbit"><History size={25}/></div><h3>A clean flight path.</h3><p>Your calculations will appear here.<br/>Let’s make the first jump.</p><span className="empty-line"/></div>}</div><div className="log-note"><span/> STORED FOR THIS SESSION</div></aside></div>
    <section className="ambient" aria-hidden="true"><div className="death-star"><div className="dish"/><div className="equator"/></div><div className="planet-label"><span className="target-cross">+</span><div>DS-1 ORBITAL STATION<small>SECTOR 04 · OUTER RIM</small></div></div></section>
    <div className="quote"><Sparkles size={16}/><p>“The Force will be with you. Always.”<span>— OBI-WAN KENOBI</span></p></div>
    </main><footer><span>BUILT FOR THIS GALAXY. AND THE NEXT.</span><span className="footer-center">A FAN-MADE EXPERIENCE</span><span>MAY THE MATH BE WITH YOU <span className="footer-star">✦</span></span></footer>
    {help && <div className="modal-backdrop" onClick={() => setHelp(false)}><section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Escape') setHelp(false); if (e.key === 'Tab') e.preventDefault(); }}><button autoFocus className="icon-button close" aria-label="Close shortcuts" onClick={() => setHelp(false)}><X/></button><Keyboard/><h2 id="help-title">Take command.</h2><p>Use your keyboard to plot the next calculation.</p><dl><div><dt>Numbers & operators</dt><dd>0–9 + − * / ( ) %</dd></div><div><dt>Calculate</dt><dd>Enter or =</dd></div><div><dt>Delete last digit</dt><dd>Backspace</dd></div><div><dt>Clear</dt><dd>Esc</dd></div></dl></section></div>}
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);

