import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/app/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: '',
                outline: 'border-2 bg-background hover:bg-accent',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md text-lg px-8',
                xl: 'h-14 rounded-lg text-xl px-9',
                icon: 'h-10 w-10',
            },
            intent: {
                success: '',
                default: '',
            },
        },
        compoundVariants: [
            {
                intent: 'success',
                variant: 'default',
                class: 'bg-green-500 hover:bg-green-600/90',
            },
            {
                intent: 'success',
                variant: 'outline',
                class: 'border-green-500 text-green-500 hover:text-green-500',
            },
            {
                intent: 'default',
                variant: 'default',
                class: 'bg-red-500 hover:bg-red-600/90',
            },
            {
                intent: 'default',
                variant: 'outline',
                class: 'border-red-500 text-red-500 hover:text-red-500',
            },
        ],
        defaultVariants: {
            variant: 'default',
            size: 'default',
            intent: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, intent, variant, size, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(
                    buttonVariants({variant, size, className, intent}),
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
