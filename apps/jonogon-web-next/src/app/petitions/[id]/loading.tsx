export default function Loading() {
    return (
        <div className={'pt-32 mx-auto max-w-screen-sm animate-pulse px-4'}>
            <div className={'bg-border w-1/2 h-7 my-4'}></div>
            <div className={'bg-border w-full h-16 my-4'}></div>
            <div className={'bg-border w-full h-96 my-4'}></div>
        </div>
    );
}
