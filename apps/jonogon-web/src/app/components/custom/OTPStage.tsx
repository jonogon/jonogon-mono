import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card';
import {Button} from '@/app/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/app/components/ui/input-otp';

interface OTPStageProps {
    otp: string;
    onOTPChange: (newValue: string) => void;
    onVerify: () => void;
    isLoading: boolean;
}

export default function OTPStage({
    otp,
    onOTPChange,
    onVerify,
    isLoading,
}: OTPStageProps) {
    const handleOTPChange = (newValue: string) => {
        onOTPChange(newValue);
    };

    const isOTPValid = /^[0-9]{4}$/g.test(otp);

    return (
        <Card className="flex flex-col gap-4">
            <CardHeader className="flex items-center">
                <img src="/images/logo.svg" alt="logo" className="w-full" />
                <CardTitle>Please enter OTP</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center w-full">
                <InputOTP maxLength={4} value={otp} onChange={handleOTPChange}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                </InputOTP>
                <Button
                    className="w-full"
                    onClick={onVerify}
                    disabled={!isOTPValid || isLoading}>
                    Verify
                </Button>
                <span>Resend OTP</span>
            </CardContent>
        </Card>
    );
}
