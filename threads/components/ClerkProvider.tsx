'use client';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import TopBar from '@/components/shared/TopBar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import RightSideBar from '@/components/shared/RightSideBar';
import BottomBar from '@/components/shared/BottomBar';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ClerkProvide({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  const chatPage = pathName.includes('whisper');
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={` bg-dark-1`}>
          <TopBar />
          <main className="flex">
            <LeftSideBar />
            <section className="main-container">
              <div
                className={`w-full h-full relative ${
                  !chatPage ? 'max-w-4xl' : ''
                }`}
              >
                {children}
              </div>
            </section>
            <RightSideBar />
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
