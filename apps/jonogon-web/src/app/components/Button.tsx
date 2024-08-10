import {cva, type VariantProps} from 'class-variance-authority';
import type {PropsWithChildren} from 'react';

export const buttonClasses = cva('', {
    variants: {
        intent: {
            primary:
                'bg-black text-white disabled:bg-gray-500 disabled:text-gray-400',
        },
        loading: {
            true: 'cursor-wait',
            false: '',
        },
    },
    defaultVariants: {
        intent: 'primary',
        loading: false,
    },
});

export function Button({
    children = 'Button',
    onClick = () => {},
    disabled = false,
    loading = false,
    intent = 'primary',
}: PropsWithChildren<
    VariantProps<typeof buttonClasses> & {
        onClick: () => void;
        disabled?: boolean;
        loading?: boolean;
    }
>) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={buttonClasses({loading})}>
            {children}
        </button>
    );
}
