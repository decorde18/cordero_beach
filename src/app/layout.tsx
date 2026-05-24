import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pool Party RSVP',
  description: 'One stop app for our upcoming pool party. Let us know what you are bringing!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
