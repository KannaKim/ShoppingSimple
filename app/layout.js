import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LoginButton from './components/LoginButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShoppingSimple",
  description: "A simple shopping application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                ShoppingSimple
              </Link>
              <div className="ml-auto">
                <LoginButton></LoginButton>
              </div>
            </div>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
