'use client';
import { addMessage } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export default function SendMessage({
  userId,
  convId,
}: {
  userId: string;
  convId: string;
}) {
  const [content, setContent] = useState('');
  const pathName = usePathname();

  async function sendMessage(e: any) {
    e.preventDefault();

    await addMessage(userId, content, convId, pathName);
    setContent('');
  }
  return (
    <form
      onSubmit={sendMessage}
      className="flex justify-between mx-4 mt-2 gap-4"
    >
      <input
        type="text"
        name=""
        id=""
        className="bg-dark-4 border-none outline-none w-full p-2"
        autoFocus
        value={content}
        onChange={(e: any) => {
          setContent(e.target.value);
        }}
      />
      <Image
        src="/assets/send.svg"
        alt="send icon"
        width={24}
        height={24}
        className="cursor-pointer"
        onClick={sendMessage}
      />
    </form>
  );
}
