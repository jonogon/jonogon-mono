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
        <Card className="flex flex-col gap-4">
            <CardHeader className="flex items-center">
                <img src="/images/logo.svg" alt="logo" className="w-full" />
                <CardTitle>Sign in to post and comment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Input
                    placeholder="Enter your phone number"
                    value={number}
                    onChange={onNumberChange}
                />
                <Button onClick={onNext} disabled={!isNumberValid || isLoading}>
                    Next
                </Button>
            </CardContent>
        </Card>
    );
}
