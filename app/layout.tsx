import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fix'D - Reverse Auction Marketplace for Home Repairs",
  description: "Connect homeowners with trusted handymen through a real-time bidding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
