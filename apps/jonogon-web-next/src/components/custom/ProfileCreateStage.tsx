import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

interface ProfileCreateStageProps {
    name: string;
    onNameChange: (newValue: string) => void;
    onCompleteProfile: () => void;
    isLoading: boolean;
}

export default function ProfileCreateStage({
    name,
    onNameChange,
    onCompleteProfile,
    isLoading,
}: ProfileCreateStageProps) {
    const isNameValid = name.trim().length > 0;

    return (
        <Card className="flex flex-col gap-4">
            <CardHeader className="flex items-center">
                <img src="/images/logo.svg" alt="logo" className="w-full" />
                <CardTitle>Create Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                />
                <Button
                    onClick={onCompleteProfile}
                    disabled={!isNameValid || isLoading}
                    className="w-full">
                    Complete Profile
                </Button>
            </CardContent>
        </Card>
    );
}
