import { ArrowUpRight, History, Trash2 } from 'lucide-react';
import type { Entry } from '../hooks/use-calculator';
import { IconButton } from './icon-button';
import { Button } from './ui/button';

export function CalculationHistory({
  entries,
  onClear,
  onRecall,
}: {
  entries: Entry[];
  onClear: () => void;
  onRecall: (result: string) => void;
}) {
  return (
    <aside
      aria-label="Calculation history"
      className="flex min-h-[245px] min-w-0 flex-col self-start rounded-[10px] border border-border bg-card/85 px-[18px] min-[701px]:min-h-[230px] min-[1101px]:min-h-[422px]"
    >
      <div className="flex min-h-[57px] items-center justify-between border-b border-border font-mono text-[9px] tracking-[1.4px]">
        <span className="flex items-center gap-2">
          <History size={16} aria-hidden="true" />
          FLIGHT LOG
        </span>
        <IconButton
          label="Clear calculation history"
          disabled={!entries.length}
          onClick={onClear}
        >
          <Trash2 size={15} />
        </IconButton>
      </div>
      <div className="pt-[18px] text-[11px] text-muted-foreground">
        Your calculations, archived.
        <span className="mt-3 block font-mono text-[8px] tracking-[1px]">
          {String(entries.length).padStart(2, '0')} ENTRIES
        </span>
      </div>
      <div className="max-h-[250px] flex-1 overflow-y-auto [scrollbar-width:thin] min-[701px]:max-h-[220px] min-[1101px]:max-h-[370px]">
        {entries.length ? (
          entries.map((entry, index) => (
            <Button
              variant="ghost"
              key={index}
              onClick={() => onRecall(entry.result)}
              aria-label={`Reuse result ${entry.result}`}
              className="block h-auto w-full rounded-none border-b border-white/5 px-[3px] py-4 text-right whitespace-normal text-muted-foreground hover:bg-white/3 [overflow-wrap:anywhere]"
            >
              <span className="font-mono text-[11px]">
                {entry.expression} =
              </span>
              <strong className="mt-[7px] flex items-center justify-end gap-[9px] font-mono text-xl font-normal text-primary">
                {entry.result}
                <ArrowUpRight size={14} aria-hidden="true" />
              </strong>
            </Button>
          ))
        ) : (
          <div className="py-[25px] text-center min-[1101px]:pt-[49px] min-[1101px]:pb-9">
            <div className="history-orbit hidden min-[1101px]:flex">
              <History size={25} aria-hidden="true" />
            </div>
            <h2 className="mt-0 mb-[9px] text-[13px] font-medium text-foreground min-[1101px]:mt-[21px]">
              A clean flight path.
            </h2>
            <p className="m-0 text-[11px] leading-[1.8] text-muted-foreground">
              Your calculations will appear here.
              <br />
              Let’s make the first jump.
            </p>
            <span className="mx-auto mt-6 hidden h-px w-[22px] bg-border min-[1101px]:block" />
          </div>
        )}
      </div>
      <div className="border-t border-border py-4 font-mono text-[7px] tracking-[0.8px] text-muted-foreground">
        <span className="mr-1.5 inline-block size-1 rounded-full bg-muted-foreground" />
        STORED FOR THIS SESSION
      </div>
    </aside>
  );
}
