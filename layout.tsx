import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Siggy — Ritual Network AI Assistant',
  description:
    'Chat with Siggy, the Ritual Network AI assistant. Ask about Ritual blockchain, Crypto × AI, EVM++, Infernet, and more.',
  keywords: ['Ritual Network', 'AI Assistant', 'Blockchain', 'Siggy', 'Crypto AI'],
  openGraph: {
    title: 'Siggy — Ritual Network AI Assistant',
    description: 'Your mystical, witty, or unhinged guide to the Ritual Network',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-[#fafafa] antialiased">
        {children}
      </body>
    </html>
  );
}
