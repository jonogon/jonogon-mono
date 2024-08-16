import {Button} from '@/app/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/app/components/ui/input-otp';
import { Label } from '../ui/label';

interface OTPStageProps {
    otp: string;
    onOTPChange: (newValue: string) => void;
    onVerify: () => void;
    onChangeNumPress: () => void;
    isLoading: boolean;
}

export default function OTPStage({
    otp,
    onOTPChange,
    onVerify,
    isLoading,
    onChangeNumPress,
}: OTPStageProps) {
    const handleOTPChange = (newValue: string) => {
        onOTPChange(newValue);
    };

    const isOTPValid = /^[0-9]{4}$/g.test(otp);

    return (
        <div className={'space-y-4'}>
            <Label htmlFor={'otp'} className={'w-full'}>
                <div className={'text-lg font-bold'}>Enter OTP</div>
                <div className={'text-base text-neutral-500'}>
                    আপনার নাম্বারে একটি ৪ সংখ্যাসর OTP পাঠানো হয়েছে, সেটি লিখুন
                </div>
            </Label>
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

            <div className="py-3 flex flex-col items-center">
                <Button
                    variant={'link'}
                    onClick={onChangeNumPress}>
                    Change Number
                </Button>
            </div>
        </div>
    );
}
