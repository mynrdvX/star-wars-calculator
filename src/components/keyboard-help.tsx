import { CircleHelp, Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const shortcuts = [
  ['Numbers & operators', '0–9 + − * / ( ) %'],
  ['Calculate', 'Enter or ='],
  ['Delete last digit', 'Backspace'],
  ['Clear', 'Esc'],
];

export function KeyboardHelp({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Keyboard shortcuts"
          className="text-muted-foreground hover:bg-white/5 hover:text-primary"
        >
          <CircleHelp size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[440px] border-panel-border bg-popover p-6 sm:p-8">
        <Keyboard className="text-primary" aria-hidden="true" />
        <DialogHeader>
          <DialogTitle className="text-[26px]">Take command.</DialogTitle>
          <DialogDescription>
            Use your keyboard to plot the next calculation.
          </DialogDescription>
        </DialogHeader>
        <dl className="text-xs">
          {shortcuts.map(([label, keys]) => (
            <div
              key={label}
              className="flex justify-between gap-2.5 border-t border-border py-[15px]"
            >
              <dt>{label}</dt>
              <dd className="m-0 font-mono text-[10px] text-primary">{keys}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
