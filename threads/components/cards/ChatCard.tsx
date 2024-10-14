'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ChatProps {
  image: string;
  lastMessage:
    | {
        createdAt: any;
        content: any;
        seen: any;
        owner: any;
      }
    | any;
  name: string;
  id: string;
  current: string;
}

export default function ChatCard({
  image,
  lastMessage,
  name,
  id,
  current,
}: ChatProps) {
  const date = new Date(lastMessage.createdAt);
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  let t;

  if (isToday) {
    // If the date is today, show only the time
    t = date.toLocaleString('en-US', options);
  } else {
    // If the date is not today, show the day of the week
    const dayOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short', // Use 'long' for full names like "Tuesday"
    };
    t = date.toLocaleString('en-US', dayOptions);
  }
  return (
    <Link
      href={`/whispers/${id}`}
      className="flex text-light-1 gap-3 items-center p-2 w-full rounded-lg cursor-pointer hover:scale-95 transition-all duration-500"
    >
      <div className="flex justify-between w-full">
        <div className="flex gap-3">
          <Image
            src={image}
            alt="user image"
            width={40}
            height={40}
            className="rounded-full"
          />

          <div>
            <h3 className="text-small-semibold">{name}</h3>

            <p
              className={`text-small-regular ${
                !lastMessage.seen && lastMessage.owner !== current
                  ? 'opacity-100'
                  : 'opacity-50'
              } `}
            >
              {lastMessage ? lastMessage.content : 'Start Conversation'}
            </p>
          </div>
        </div>

        <p
          className={`${
            !lastMessage.seen && lastMessage.owner !== current
              ? 'opacity-100'
              : 'opacity-50'
          } `}
          style={{ fontSize: '12px' }}
        >
          {t}
        </p>
      </div>
    </Link>
  );
}
