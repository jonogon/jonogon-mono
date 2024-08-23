import * as React from 'react';
import {cn} from '@/lib/utils';

export interface AutoCompleteInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    options: string[];
}

const AutoCompleteInput = React.forwardRef<
    HTMLInputElement,
    AutoCompleteInputProps
>(({className, options, value, onChange, ...props}, ref) => {
    const [filteredOptions, setFilteredOptions] = React.useState<string[]>([]);
    const [showOptions, setShowOptions] = React.useState(false);

    React.useEffect(() => {
        if (value && showOptions) {
            const filtered = options.filter((option) =>
                option.toLowerCase().includes(value.toString().toLowerCase()),
            );
            setFilteredOptions(filtered);
            setShowOptions(true);
        } else {
            setShowOptions(false);
        }
    }, [value, showOptions]);

    const handleOptionClick = (option: string) => {
        if (onChange) {
            onChange({
                target: {value: option},
            } as React.ChangeEvent<HTMLInputElement>);
        }
        setShowOptions(false);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
        setShowOptions(true);
    };

    return (
        <div className="relative">
            <input
                className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                ref={ref}
                value={value}
                autoComplete="off"
                onChange={onInputChange}
                {...props}
            />
            {showOptions && (
                <ul className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleOptionClick(option)}>
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-muted-foreground">
                            No options available
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
});

AutoCompleteInput.displayName = 'AutoCompleteInput';

export {AutoCompleteInput};
