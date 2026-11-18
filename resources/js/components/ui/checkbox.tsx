import { CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type CheckboxProps = Omit<React.ComponentProps<'input'>, 'type'> & {
    onCheckedChange?: (checked: boolean) => void;
};

function Checkbox({
    className,
    onChange,
    onCheckedChange,
    ...props
}: CheckboxProps) {
    return (
        <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
            <input
                type="checkbox"
                data-slot="checkbox"
                onChange={(event) => {
                    onChange?.(event);
                    onCheckedChange?.(event.target.checked);
                }}
                className={cn(
                    'peer size-4 shrink-0 cursor-pointer appearance-none rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow,background-color,border-color] outline-none checked:border-primary checked:bg-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                    className,
                )}
                {...props}
            />
            <CheckIcon
                aria-hidden="true"
                className="pointer-events-none absolute size-3 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
            />
        </span>
    );
}

export { Checkbox };
