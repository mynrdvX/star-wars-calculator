import { useEffect, useState } from 'react';
import { Orbit, Radio, Sparkles } from 'lucide-react';
import { useCalculator } from './hooks/use-calculator';
import { CalculatorPanel } from './components/calculator-panel';
import { CalculationHistory } from './components/calculation-history';
import { KeyboardHelp } from './components/keyboard-help';
import { TooltipProvider } from './components/ui/tooltip';
import { type ForceTheme } from './components/theme-selector';

export default function App() {
  const [side, setSide] = useState<ForceTheme>('Balance');
  const [help, setHelp] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const calculator = useCalculator(!help && !themeMenuOpen);
  // Portaled dialogs and menus inherit the selected theme from the document.
  useEffect(() => {
    document.documentElement.dataset.side = side;
    return () => {
      delete document.documentElement.dataset.side;
    };
  }, [side]);
  return (
    <TooltipProvider>
      <div className="app" data-side={side}>
        <a
          href="#calculator"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
        >
          Skip to calculator
        </a>
        <div className="stars" aria-hidden="true" />
        <header>
          <a className="brand" href="./">
            <Orbit size={29} />
            <span>
              HOLO<span className="brand-light">CALC</span>
              <small>A GALAXY OF POSSIBILITIES</small>
            </span>
          </a>
          <div className="header-right">
            <span className="online">
              <i /> SYSTEM ONLINE
            </span>
            <KeyboardHelp open={help} onOpenChange={setHelp} />
            <span className="version">V.01</span>
          </div>
        </header>

        <main>
          <section className="intro">
            <div className="eyebrow">
              <span /> YOUR PERSONAL NAVICOMPUTER
            </div>
            <h1>
              Calculate your
              <br />
              <em>destiny.</em>
            </h1>
            <p>
              From simple sums to hyperspace coordinates.
              <br />
              Every great mission starts with a calculation.
            </p>
            <div className="sector">
              <Radio size={14} /> CORUSCANT SECTOR <span> // </span> 0.0.0.1
            </div>
          </section>

          <div className="workspace">
            <CalculatorPanel
              {...calculator}
              theme={side}
              onThemeChange={setSide}
              onThemeOpenChange={setThemeMenuOpen}
            />
            <CalculationHistory
              entries={calculator.state.history}
              onClear={() => calculator.dispatch('clear-history')}
              onRecall={(result) => calculator.dispatch('recall:' + result)}
            />
          </div>
          <section className="ambient" aria-hidden="true">
            <div className="death-star">
              <div className="dish" />
              <div className="equator" />
            </div>
            <div className="planet-label">
              <span className="target-cross">+</span>
              <div>
                DS-1 ORBITAL STATION<small>SECTOR 04 · OUTER RIM</small>
              </div>
            </div>
          </section>
          <div className="quote">
            <Sparkles size={16} />
            <p>
              “The Force will be with you. Always.”<span>— OBI-WAN KENOBI</span>
            </p>
          </div>
        </main>
        <footer>
          <span>BUILT FOR THIS GALAXY. AND THE NEXT.</span>
          <span className="footer-center">A FAN-MADE EXPERIENCE</span>
          <span>
            MAY THE MATH BE WITH YOU <span className="footer-star">✦</span>
          </span>
        </footer>
      </div>
    </TooltipProvider>
  );
}
