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
        <div className={'space-y-4'}>
            <label htmlFor={'otp'} className={'w-full'}>
                <div className={'text-lg font-bold'}>Enter OTP</div>
                <div className={'text-base text-neutral-500'}>
                    আপনার নাম্বারে একটি ৪ সংখ্যাসর OTP পাঠানো হয়েছে, সেটি লিখুন
                </div>
            </label>

            <InputOTP
                id={'otp'}
                autoFocus
                maxLength={4}
                value={otp}
                onChange={handleOTPChange}>
                <InputOTPGroup className={'w-full'}>
                    <InputOTPSlot
                        index={0}
                        className={'w-full bg-white text-2xl h-16'}
                    />
                    <InputOTPSlot
                        index={1}
                        className={'w-full bg-white text-2xl h-16'}
                    />
                    <InputOTPSlot
                        index={2}
                        className={'w-full bg-white text-2xl h-16'}
                    />
                    <InputOTPSlot
                        index={3}
                        className={'w-full bg-white text-2xl h-16'}
                    />
                </InputOTPGroup>
            </InputOTP>
            <Button
                className="w-full"
                onClick={onVerify}
                disabled={!isOTPValid || isLoading}
                size={'lg'}>
                Verify
            </Button>
        </div>
    );
}
