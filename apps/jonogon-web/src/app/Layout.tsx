import React from 'react';
import Navigation from './components/custom/Navigation';

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Navigation />
            <div className={'mt-16'}>{children}</div>
        </>
    );
};

export default Layout;
