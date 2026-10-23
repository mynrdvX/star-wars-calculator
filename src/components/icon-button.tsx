import type { ComponentProps } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '../lib/utils';

type IconButtonProps = ComponentProps<typeof Button> & { label: string };

export function IconButton({ label, className, ...props }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn(
            'size-9 shrink-0 text-muted-foreground hover:bg-white/5 hover:text-primary',
            className,
          )}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
