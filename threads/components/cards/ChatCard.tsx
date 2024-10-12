'use client';
import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <Link
      href={`/whispers/${id}`}
      className="flex text-light-1 gap-3 items-center p-2 w-full rounded-lg cursor-pointer hover:scale-95 transition-all duration-500"
    >
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
          className={`text-small-regular opacity-50 ${
            !lastMessage.seen && !(lastMessage.owner === current)
              ? 'opacity-100'
              : ''
          } `}
        >
          {lastMessage ? lastMessage.content : 'Start Conversation'}
        </p>
      </div>
    </Link>
  );
}
