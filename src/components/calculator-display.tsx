import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Delete } from 'lucide-react';
import type { State } from '../hooks/use-calculator';
import { IconButton } from './icon-button';
import { cn } from '../lib/utils';

type CalculatorDisplayProps = {
  state: State;
  onDelete: () => void;
};

export function CalculatorDisplay({ state, onDelete }: CalculatorDisplayProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const displayValue = state.finished ? state.result : state.expression;

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  async function copyDisplay() {
    clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(displayValue || '0');
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    copyTimer.current = setTimeout(() => setCopyStatus('idle'), 1600);
  }

  return (
    <div className="rounded-md border border-display-border bg-display px-[15px] pt-2.5 pb-[5px] shadow-[inset_0_2px_12px_#0005]">
      <div className="flex items-center justify-between text-display-muted">
        <span className="font-mono text-[8px] tracking-[1px]">
          INPUT SEQUENCE
        </span>
        <IconButton
          label={copyStatus === 'copied' ? 'Copied' : 'Copy display'}
          onClick={copyDisplay}
        >
          {copyStatus === 'copied' ? <Check size={15} /> : <Copy size={15} />}
        </IconButton>
      </div>
      <div className="min-h-[26px] pt-[9px] text-right font-mono text-xs text-display-muted [overflow-wrap:anywhere]">
        {state.finished ? state.expression + ' =' : '\u00a0'}
      </div>
      <output
        aria-live="polite"
        className={cn(
          'block min-h-[70px] text-right font-mono text-[44px] leading-[1.6] tracking-[-2px] text-display-foreground [overflow-wrap:anywhere]',
          displayValue.length > 12 && 'py-3.5 text-[25px] tracking-[-1px]',
        )}
      >
        {state.finished
          ? Number(state.result).toLocaleString('en-US', {
              maximumSignificantDigits: 12,
            })
          : state.expression || '0'}
      </output>
      <div
        className={cn(
          'mt-[5px] flex items-center justify-between border-t border-white/5 font-mono text-[7px] tracking-[1px] text-display-muted',
          state.error && 'text-[9px] tracking-normal text-destructive',
        )}
      >
        <span role="status">
          {state.error ||
            (copyStatus === 'failed'
              ? 'COPY UNAVAILABLE'
              : state.finished
                ? 'CALCULATION COMPLETE'
                : 'AWAITING YOUR COMMAND')}
        </span>
        <IconButton label="Delete last character" onClick={onDelete}>
          <Delete size={18} />
        </IconButton>
      </div>
    </div>
  );
}
