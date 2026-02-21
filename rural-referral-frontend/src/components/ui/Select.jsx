import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div className="relative w-full">
            <select
                className={cn(
                    "flex h-11 w-full appearance-none rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all hover:border-surface-300 shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-400">
                <ChevronDown className="h-4 w-4" />
            </div>
        </div>
    )
})
Select.displayName = "Select"

export { Select };
