import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
    return (
        <div className="relative w-full">
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all hover:border-surface-300 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-50",
                    error && "border-red-500 focus:ring-red-500/50 focus:border-red-500 hover:border-red-500",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-xs text-red-500 font-medium tracking-wide">
                    {error}
                </p>
            )}
        </div>
    )
})
Input.displayName = "Input"

const Label = React.forwardRef(({ className, children, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none text-surface-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2",
            className
        )}
        {...props}
    >
        {children}
    </label>
))
Label.displayName = "Label"

export { Input, Label };
