import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
        default: 'bg-surface-100 text-surface-700 border-surface-200/60',
        primary: 'bg-brand-50 text-brand-700 border-brand-200/50',
        success: 'bg-[var(--color-urgency-low-bg)] text-[var(--color-urgency-low-text)] border-[var(--color-urgency-low-bg)]',
        warning: 'bg-[var(--color-urgency-med-bg)] text-[var(--color-urgency-med-text)] border-[var(--color-urgency-med-bg)]',
        danger: 'bg-[var(--color-urgency-high-bg)] text-[var(--color-urgency-high-text)] border-[var(--color-urgency-high-bg)]',
        outline: 'text-surface-600 border border-surface-200 bg-transparent'
    };

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors border shadow-sm",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Badge.displayName = "Badge";

export { Badge };
