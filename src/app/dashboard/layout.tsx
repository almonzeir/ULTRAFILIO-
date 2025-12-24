import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow pb-0">
                {children}
            </main>
            <Footer hideCTA />
        </div>
    );
}
