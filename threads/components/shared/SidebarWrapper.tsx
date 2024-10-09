import React, { ReactNode } from 'react';

function SidebarWrapper({ children }: { children: ReactNode }) {
  return (
    <section className={`w-full h-full relative `}>
      <div className="h-[calc(100%)] lg:h-full w-full flex gap-8">
        {children}
      </div>
    </section>
  );
}

export default SidebarWrapper;
