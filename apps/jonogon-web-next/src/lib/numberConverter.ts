const BENGALI_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(number: number | string): string {
    return number
        .toString()
        .replace(/[0-9]/g, (digit) => BENGALI_NUMERALS[parseInt(digit)]);
}

export function fromBengaliNumber(bengaliNumber: string): string {
    return bengaliNumber.replace(/[০-৯]/g, (digit) =>
        BENGALI_NUMERALS.indexOf(digit).toString(),
    );
}
