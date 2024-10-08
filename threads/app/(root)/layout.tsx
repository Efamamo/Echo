import localFont from 'next/font/local';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import TopBar from '@/components/shared/TopBar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import RightSideBar from '@/components/shared/RightSideBar';
import BottomBar from '@/components/shared/BottomBar';
import { headers } from 'next/headers';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Echo',
  description: 'Nest 14 Meta Threads Application',
  icons: {
    icon: '/assets/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={` bg-dark-1`}>
          <TopBar />
          <main className="flex">
            <LeftSideBar />
            <section className="main-container">{children}</section>
            <RightSideBar />
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
