import { ClerkProvider } from '@clerk/nextjs';

import { ReactNode } from 'react';
export const metadata = {
  title: 'Threads',
  description: 'Nest 14 Meta Threads Application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={` bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
