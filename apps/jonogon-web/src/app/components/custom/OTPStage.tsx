import {Button} from '@/app/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/app/components/ui/input-otp';
import {Label} from '../ui/label';
import useRerenderInterval from '@/app/lib/useRerenderInterval';

interface OTPStageProps {
    otp: string;
    onOTPChange: (newValue: string) => void;
    onVerify: () => void;
    onChangeNumPress: () => void;
    onOtpResendPress: () => void;
    isLoading: boolean;
}

const OTP_RESEND_INTERVAL = 60;

const OtpResendSection = ({
    onOtpResendPress,
    isDisabled,
}: {
    onOtpResendPress: () => void;
    isDisabled?: boolean;
}) => {
    const [count, resetCount] = useRerenderInterval(
        1000,
        (count) => count < OTP_RESEND_INTERVAL,
    );

    const remainingTime = OTP_RESEND_INTERVAL - count;
    const remainingTimeStr = `${remainingTime} second${remainingTime > 1 ? 's' : ''}`;

    return (
        <div className="flex flex-col items-center gap-5">
            {remainingTime === 0 ? null : (
                <p className="text-sm">
                    Didn't receive OTP? Retry sending otp in
                    <span className="text-red-600"> {remainingTimeStr}</span>
                </p>
            )}
            <Button
                size={'sm'}
                variant={'link'}
                disabled={isDisabled || remainingTime !== 0}
                onClick={() => {
                    onOtpResendPress();
                    resetCount();
                }}>
                Resend OTP
            </Button>
        </div>
    );
};

export default function OTPStage({
    otp,
    onOTPChange,
    onVerify,
    isLoading,
    onChangeNumPress,
    onOtpResendPress,
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
                    className="text-red-600"
                    variant={'link'}
                    onClick={onChangeNumPress}>
                    Change Number
                </Button>
            </div>

            <OtpResendSection
                onOtpResendPress={onOtpResendPress}
                isDisabled={isLoading}
            />
        </div>
    );
}
