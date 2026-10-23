import { AudioLines, Keyboard, Orbit } from 'lucide-react';
import type { State } from '../hooks/use-calculator';
import { CalculatorDisplay } from './calculator-display';
import { CalculatorKeypad } from './calculator-keypad';
import { ThemeSelector, type ForceTheme } from './theme-selector';
import { Button } from './ui/button';

export function CalculatorPanel({
  state,
  press,
  sound,
  toggleSound,
  theme,
  onThemeChange,
  onThemeOpenChange,
}: {
  state: State;
  press: (key: string) => void;
  sound: boolean;
  toggleSound: () => void;
  theme: ForceTheme;
  onThemeChange: (theme: ForceTheme) => void;
  onThemeOpenChange: (open: boolean) => void;
}) {
  return (
    <section
      id="calculator"
      tabIndex={-1}
      aria-label="Calculator"
      className="min-w-0 rounded-xl border border-panel-border bg-linear-to-br from-panel-top to-panel-bottom px-[17px] shadow-[0_24px_70px_#0006,inset_0_1px_0_#ffffff0b] min-[701px]:px-5"
    >
      <div className="flex min-h-[57px] items-center justify-between border-b border-border font-mono text-[10px] tracking-[1.4px]">
        <span className="flex items-center gap-2">
          <Orbit size={16} className="text-primary" aria-hidden="true" />{' '}
          NAVICOMPUTER
        </span>
        <span className="flex items-center gap-2 font-mono text-[8px] tracking-[1px] text-muted-foreground">
          CORE / 01 <i className="status-dot" />
        </span>
      </div>
      <div className="flex items-center justify-between py-4">
        <span className="flex items-center gap-2 font-mono text-[8px] tracking-[1.2px] text-foreground">
          <i className="size-1 rounded-full bg-primary" />
          STANDARD
        </span>
        <ThemeSelector
          value={theme}
          onChange={onThemeChange}
          onOpenChange={onThemeOpenChange}
        />
      </div>
      <CalculatorDisplay state={state} onDelete={() => press('backspace')} />
      <CalculatorKeypad onPress={press} />
      <div className="flex h-[49px] items-center justify-between text-[9px] text-muted-foreground">
        <span className="flex items-center gap-[7px]">
          <Keyboard size={14} aria-hidden="true" />
          Keyboard ready
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-[7px] px-0 text-[9px] text-muted-foreground hover:bg-transparent hover:text-primary"
          onClick={toggleSound}
          aria-pressed={sound}
        >
          <AudioLines size={14} aria-hidden="true" />
          Sound {sound ? 'on' : 'off'}
        </Button>
      </div>
    </section>
  );
}
