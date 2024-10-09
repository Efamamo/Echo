'use client';
import SearchBar from '@/components/forms/SearchBar';
import { Card } from '@/components/ui/card';
import { useConversation } from '@/hooks/useConversation';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface Props {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ItemList({ title, action, children }: Props) {
  const { isActive } = useConversation();
  return (
    <Card
      className={cn(
        'hidden h-full bg-dark-2 w-full lg:flex-none lg:w-72 p-2 border-none',
        { block: !isActive, 'lg:block': isActive }
      )}
    >
      <SearchBar
        searchString=""
        setSearchString={() => {}}
        submit={() => {}}
        placeHolder="chat"
      />
      <div className="w-full h-full flex flex-col items-center justify-start gap-2">
        {children}
      </div>
    </Card>
  );
}
