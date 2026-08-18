import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AegisScrape | Autonomous Self-Healing Scraper Observability',
  description: 'Zero-downtime, self-repairing web scraping engine for Bright Data Scraper Studio. WeMakeDevs Into the Scrape-Verse submission.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
