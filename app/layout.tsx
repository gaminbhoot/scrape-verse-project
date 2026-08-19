import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AegisScrape | Autonomous Self-Healing Scraper Observability',
  description:
    'Zero-downtime, self-repairing web scraping engine for Bright Data Scraper Studio. WeMakeDevs Into the Scrape-Verse submission.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fdfcf9] text-[#0f172a] antialiased min-h-screen selection:bg-[#c9a86a]/20 selection:text-[#2a2215]">
        {children}
      </body>
    </html>
  );
}
