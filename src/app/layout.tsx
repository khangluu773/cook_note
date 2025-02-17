import { RecipeProvider } from '@/context/RecipeContext';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import login_logo from "@/public/login_logo.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CookNote - Budget-Friendly Recipes",
  description: "Find and save affordable recipes perfect for college students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecipeProvider>
          <nav className="bg-teal-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-white text-2xl font-bold">CookNote</h1>
              <div className="flex space-x-4 items-center">
                <Link href="/" className="text-white hover:text-teal-100">Home</Link> 
                <Link href="/my-recipes" className="text-white hover:text-teal-100">My Recipes</Link>
                <Link href="/budget-calculator" className="text-white hover:text-teal-100">Budget Calculator</Link>
                <Link href="/Login" className="text-white hover:text-teal-100 flex items-center space-x-2">
                  <span>Login</span>
                  <Image src="/login_logo.png" alt="Login Logo" width={20} height={20} className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </RecipeProvider>
      </body>
    </html>
  );
}
