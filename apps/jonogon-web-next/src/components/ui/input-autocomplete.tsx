import * as React from 'react';
import {cn} from '@/lib/utils';

export interface AutoCompleteInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    options: string[];
}

// TODO: replace with shadcn Command component?
const AutoCompleteInput = React.forwardRef<
    HTMLInputElement,
    AutoCompleteInputProps
>(({className, options, value, onChange, ...props}, ref) => {
    const [filteredOptions, setFilteredOptions] = React.useState<string[]>([]);
    const [showOptions, setShowOptions] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

    const optionsUlRef = React.useRef<HTMLUListElement>(null);

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

    React.useEffect(() => {
        if (selectedIndex !== null && optionsUlRef.current) {
            const opt = optionsUlRef.current.children[selectedIndex];
            opt?.scrollIntoView({block: 'nearest'});
        }
    }, [selectedIndex]);

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

    const hideOptions = () => {
        setShowOptions(false);
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
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        hideOptions();
                        setSelectedIndex(null);
                        return;
                    }

                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setSelectedIndex((prev) => {
                            if (prev === null || prev === filteredOptions.length - 1) {
                                return 0;
                            }
                            return prev + 1;
                        });
                        return;
                    }

                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setSelectedIndex((prev) => {
                            if (prev === null || prev === 0) {
                                return filteredOptions.length - 1;
                            }
                            return prev - 1;
                        });
                        return;
                    }

                    if (e.key === 'Enter' && selectedIndex !== null && filteredOptions[selectedIndex]) {
                        handleOptionClick(filteredOptions[selectedIndex]);
                        setSelectedIndex(null);
                        return;
                    }


                    setSelectedIndex(null);
                }}
                onBlur={hideOptions}
                {...props}
            />
            {showOptions ? (
                <ul ref={optionsUlRef} className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className={cn("px-3 py-2 cursor-pointer hover:bg-gray-100", index === selectedIndex && 'bg-gray-100')}
                                onClick={() => handleOptionClick(option)}
                                onMouseOver={() => setSelectedIndex(null)}
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-muted-foreground cursor-pointer" onClick={hideOptions}>
                            No options available
                        </li>
                    )}
                </ul>
            ) : null}
        </div>
    );
});

AutoCompleteInput.displayName = 'AutoCompleteInput';

export {AutoCompleteInput};
