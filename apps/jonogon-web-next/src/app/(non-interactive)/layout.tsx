export const runtime = 'edge';

import '../../../../../styles/non-interactive.css';
import React from 'react';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={''}>{children}</body>
        </html>
    );
}
