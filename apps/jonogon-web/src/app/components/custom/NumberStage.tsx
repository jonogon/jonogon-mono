import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card';
import {Input} from '@/app/components/ui/input';
import {Button} from '@/app/components/ui/button';

interface NumberStageProps {
    number: string;
    onNumberChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
    isLoading: boolean;
}

export default function NumberStage({
    number,
    onNumberChange,
    onNext,
    isLoading,
}: NumberStageProps) {
    const isNumberValid = /^01[0-9]{9}$/g.test(number);

    return (
        <div className={'flex flex-col space-y-2'}>
            <label htmlFor={'phone'} className={'w-full'}>
                <div className={'text-lg font-bold'}>Phone Number</div>
                <div className={'text-base text-neutral-500'}>
                    আপনার ফোন নাম্বারটি লিখুন
                </div>
            </label>
            <Input
                id={'phone'}
                className={'text-2xl py-6 px-4 bg-white'}
                placeholder="01xxxxxxxxx"
                value={number}
                onChange={onNumberChange}
                autoFocus
                type={'text'}
                pattern="[0-9]*"
                inputMode="numeric"
            />
            <Button
                className={'w-full'}
                size={'lg'}
                onClick={onNext}
                disabled={!isNumberValid || isLoading}>
                Next
            </Button>
        </div>
    );
}
