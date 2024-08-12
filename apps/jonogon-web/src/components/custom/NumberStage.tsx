import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Button} from '@/components/ui/button.tsx';

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
                <img src="/images/logo.png" alt="logo" className="w-24 h-24" />
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
