import SidebarWrapper from '@/components/shared/SidebarWrapper';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { ReactNode } from 'react';

function Layout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarWrapper>{children}</SidebarWrapper>
    </TooltipProvider>
  );
}

export default Layout;
