import { Card } from '@/components/ui/card';
import React from 'react';

export default function Fallback() {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-dark-2 text-light-1 border-none">
      <div className="w-full h-full flex justify-center items-center">
        <h3>Select a Chat to start Messaging</h3>
      </div>
    </Card>
  );
}
