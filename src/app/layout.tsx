import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { getServerSession } from "next-auth";
// import { authOptions } from "./api/auth/[...nextauth]/route";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UIProvider from "@/components/providers/UiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "News Feed Article",
  description: "Get News Article From Any Website Around The World ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <QueryProvider>
          <UIProvider>
            {children}
            <ToastContainer />
          </UIProvider>
          {/* <AuthProvider session={session}> */}
            
          {/* </AuthProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
