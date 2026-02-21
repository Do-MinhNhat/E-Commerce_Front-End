import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/layout/ChatBot";
import { initializeEmbeddings } from "@/lib/initEmbeddings";

export const metadata: Metadata = {
  title: "EStore - Your Online Shopping Destination",
  description: "Shop amazing products at unbeatable prices. Browse electronics, clothing, home & garden, and more.",
};

// Initialize embeddings once at module load (server startup)
initializeEmbeddings();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
