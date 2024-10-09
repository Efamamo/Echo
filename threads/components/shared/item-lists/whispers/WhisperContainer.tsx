import { Card } from '@/components/ui/card';
import React, { ReactNode } from 'react';

export default function WhisperConatiner({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Card className="w-full border-none h-full flex flex-col gap-2 bg-dark-2 text-light-1 p-2">
      {children}
    </Card>
  );
}
