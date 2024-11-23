import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";
import Header from "./components/Header";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Worker's Tools",
  description: "Ferramentas para profissionais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
            <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] py-6">
              <div className="container mx-auto px-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
                2024 Worker's Tools. Todos os direitos reservados.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
