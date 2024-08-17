import * as React from 'react';

import {cn} from '@/app/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    suggestions?: string[];
    handleChange: (
        name: 'target' | 'location' | 'title' | 'description',
        value: string,
    ) => void;
    name: 'target' | 'location' | 'title' | 'description';
}

const AutoSuggest = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, suggestions, handleChange, name, ...props}, ref) => {
        const [showSuggestion, setShowSuggestion] = React.useState(false);
        return (
            <>
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    ref={ref}
                    {...props}
                    onFocus={() => setShowSuggestion(true)}
                />
                {showSuggestion && (
                    <ul className="bg-white">
                        {suggestions?.map(
                            (item) =>
                                item.includes(
                                    typeof props?.value === 'string'
                                        ? props.value
                                        : '',
                                ) && (
                                    <li
                                        className="p-2 border-b hover:cursor-pointer hover:bg-['#F2F2F7']"
                                        onClick={() => {
                                            handleChange(name, item);
                                            setShowSuggestion(false);
                                        }}>
                                        {item}
                                    </li>
                                ),
                        )}
                    </ul>
                )}
            </>
        );
    },
);
AutoSuggest.displayName = 'AutoSuggest';

export {AutoSuggest};
