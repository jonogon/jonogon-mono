import type {Metadata} from 'next';

import '../styles/globals.css';

import React, {Suspense} from 'react';
import AuthWrapper from '@/auth/Wrapper';
import {TRPCWrapper} from '@/trpc/Wrapper';
import Navigation from '@/components/custom/Navigation';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
    title: 'Jonogon — জনগণ',
    description: 'আমাদের দাবির প্লাটফর্ম',
    openGraph: {
        title: 'Jonogon — জনগণ',
        description: 'আমাদের দাবির প্লাটফর্ম',
        url: 'https://jonogon.org',
        siteName: 'jonogon.org',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={''}>
                <AuthWrapper>
                    <TRPCWrapper hostname={'localhost'}>
                        <Suspense fallback={<>LOADING ...</>}>
                            <Navigation />
                            <div className={'mt-16'}>
                                <Toaster />
                                {children}
                            </div>
                        </Suspense>
                    </TRPCWrapper>
                </AuthWrapper>
            </body>
        </html>
    );
}
