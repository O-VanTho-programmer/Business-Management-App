import type { Metadata } from "next";

import "./globals.css";
import { AlertProvider } from "@/components/AlertProvider/AlertContext";

export const metadata: Metadata = {
  title: "Stock Management",
  description: "Stock & Revenue Management Website",
  icons: {
    icon: '/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
