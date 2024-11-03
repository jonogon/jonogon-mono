import RootLayout from '@/app/layout'; // Import the RootLayout
export const metadata = {
    title: 'Petition Preview',
    robots: {
        index: false,
        follow: false,
    },
};

export const viewport = {
    width: '1200',
    height: '630',
    initialScale: 1,
};

export default function PreviewImageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RootLayout isCustomLayout={true}>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    body {
                        margin: 0;
                        padding: 0;
                        width: 1200px;
                        height: 630px;
                        overflow: hidden;
                    }
                `,
                }}
            />
            {children}
        </RootLayout>
    );
}
