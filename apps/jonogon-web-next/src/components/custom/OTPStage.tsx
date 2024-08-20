import {Button} from '@/components/ui/button';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {Label} from '../ui/label';
import useRerenderInterval from '@/lib/useRerenderInterval';

interface OTPStageProps {
    number: string;
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
        <div className="flex flex-col items-center gap-2">
            {remainingTime === 0 ? null : (
                <p className="text-stone-500">
                    OTP পাননি? Retry করতে পারবেন
                    <span className="text-red-600"> {remainingTimeStr} </span>
                    পরে
                </p>
            )}
            {remainingTime !== 0 ? null : (
                <Button
                    size={'sm'}
                    variant={'outline'}
                    disabled={isDisabled || remainingTime !== 0}
                    onClick={() => {
                        onOtpResendPress();
                        resetCount();
                    }}>
                    Resend OTP
                </Button>
            )}
        </div>
    );
};

export default function OTPStage({
    number,
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
                    আপনার{' '}
                    <span className={'font-bold text-red-600'}>{number}</span>{' '}
                    নাম্বারে একটি ৪ সংখ্যাসর OTP পাঠানো হয়েছে, সেটি লিখুন{' '}
                    <Button
                        className="text-red-600 h-6 px-2"
                        variant={'link'}
                        onClick={onChangeNumPress}>
                        Change Number
                    </Button>
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

            <OtpResendSection
                onOtpResendPress={onOtpResendPress}
                isDisabled={isLoading}
            />
        </div>
    );
}
