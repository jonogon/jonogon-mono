const Preloader = () => {
    return (
        <div className="h-dvh flex flex-col justify-center items-center select-none">
            <div className="h-48">
                <img src="/images/icon.svg" alt="" className="h-48" />
            </div>
            <h2 className="uppercase text-3xl mt-7 font-medium">Jonogon</h2>
            <p className="mt-2 text-neutral-500">
                Empowering Your Voice, One Claim at a Time
            </p>
        </div>
    );
};

export default Preloader;
