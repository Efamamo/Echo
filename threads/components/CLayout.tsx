'use client'; // This marks the file as a Client Component

import { ClerkProvider } from '@clerk/nextjs';
import TopBar from '@/components/shared/TopBar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import RightSideBar from '@/components/shared/RightSideBar';
import BottomBar from '@/components/shared/BottomBar';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isChatPage = pathName.includes('whisper');

  return (
    <ClerkProvider>
      <main className="flex">
        <TopBar />
        <LeftSideBar />
        <section className="main-container">
          <div
            className={`w-full h-full relative ${
              !isChatPage ? 'max-w-4xl' : ''
            }`}
          >
            {children}
          </div>
        </section>
        <RightSideBar />
        <BottomBar />
      </main>
    </ClerkProvider>
  );
}
