import Nav from "@/components/Nav/Nav";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Nav />
            <div className="container bg_slate_blue">
                {children}
            </div>
        </>
    );
}
