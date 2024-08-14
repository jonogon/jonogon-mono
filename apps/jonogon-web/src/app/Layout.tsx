import React from 'react';
import Navigation from './components/custom/Navigation';

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="container flex flex-col relative">
            <Navigation />
            <div className="h-[calc(100dvh-65px)] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;
