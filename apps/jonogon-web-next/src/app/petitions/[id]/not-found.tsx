import ErrorGui from '@/components/custom/ErrorGui';

export const runtime = 'edge';

export default function NotFound() {
    return <ErrorGui errorCode={404} customErrorCode="PETITION_NOT_FOUND" />;
}
