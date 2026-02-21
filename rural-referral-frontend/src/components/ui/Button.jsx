import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', isLoading = false, children, disabled, ...props }, ref) => {
    const variants = {
        primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-soft shadow-inner-light active:translate-y-[1px] border border-transparent',
        secondary: 'bg-surface-100 text-surface-800 hover:bg-surface-200 border border-surface-200 active:translate-y-[1px] shadow-sm',
        outline: 'border border-surface-300 bg-white text-surface-700 hover:bg-surface-50 hover:text-surface-900 active:translate-y-[1px]',
        ghost: 'hover:bg-surface-100 text-surface-600 hover:text-surface-900 transition-colors',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft shadow-inner-light active:translate-y-[1px] border border-transparent'
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-4 py-2 text-sm rounded-lg',
        lg: 'h-12 px-8 text-base rounded-xl',
        icon: 'h-10 w-10 text-center flex justify-center rounded-lg'
    };

    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(
                'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});
Button.displayName = 'Button';

export { Button };
