import { Outfit, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "../components/ui/sonner"
import { ThemeProvider } from "../components/theme-provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Expense Tracker",
  description: "",
  icons: {
    icon: "/favicon.ico",},
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
        
        {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
