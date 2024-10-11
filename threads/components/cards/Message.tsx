'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { markMessageAsSeen } from '@/lib/actions/user.actions'; // Ensure this action is implemented
import DeleteChat from '../forms/DeleteChat';
import UpdateChat from '../forms/UpdateChat';

export default function Message({
  content,
  owner,
  current,
  time,
  id,
  seen,
  chatId,
}: {
  owner: any;
  content: string;
  current: any;
  time: any;
  id: string;
  seen: boolean;
  chatId: string;
}) {
  const [open, setOpen] = useState(false);
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const t = date.toLocaleString('en-US', options);

  useEffect(() => {
    // If the message is not seen and the current user is not the owner, mark it as seen
    if (!seen && current !== owner) {
      markMessageAsSeen(id, current, chatId); // This will call your server to update the "seen" status
    }
  }, [seen, current, owner, id]);

  return (
    <div
      className={`max-w-64 justify-start rounded-full  bg-dark-4 ${
        !(owner === current)
          ? 'ml-auto justify-end rounded-tr-none'
          : 'rounded-tl-none mr-auto bg-[#1f2d4d]'
      } flex items-end gap-2 py-2 px-4  m-2 relative`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <h3>{content}</h3>
      <div
        className={`flex items-center gap-0.5 ${
          owner === current ? 'relative top-0.5' : ''
        }`}
      >
        <p className="text-gray-400" style={{ fontSize: '10px' }}>
          {t}
        </p>
        {owner === current && !seen && (
          <Image src="/assets/single.svg" alt="seen" width={20} height={20} />
        )}
        {owner === current && seen && (
          <Image src="/assets/tick.svg" alt="seen" width={20} height={20} />
        )}
      </div>
      {open && owner === current && (
        <div className="absolute top-0 -right-24 flex flex-col p-3 gap-4 bg-dark-3 z-50">
          <UpdateChat />
          <DeleteChat messageId={id} userId={current} chatId={chatId} />
        </div>
      )}
    </div>
  );
}
