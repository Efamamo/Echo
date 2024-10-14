'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { markMessageAsSeen, updateMessage } from '@/lib/actions/user.actions'; // Ensure this action is implemented
import DeleteChat from '../forms/DeleteChat';
import UpdateChat from '../forms/UpdateChat';
import { usePathname } from 'next/navigation';

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
  const [isEditing, setIsEditing] = useState(false);
  const [inpValue, setInpvalue] = useState(content);
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

  const path = usePathname();

  async function update(e: any) {
    e.preventDefault();
    await updateMessage(current, inpValue, chatId, path, id);
    setIsEditing(false);
  }

  return (
    <div
      className={`max-w-64 justify-start rounded-full  bg-dark-4 ${
        !(owner === current)
          ? 'ml-auto justify-end rounded-tr-none'
          : 'rounded-tl-none mr-auto bg-[#243255]'
      } flex items-end gap-2 py-2 px-4  m-2 relative z-10`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {!isEditing && <h3>{content}</h3>}
      {isEditing && (
        <form onSubmit={update}>
          <input
            className="bg-transparent border-none outline-none text-light-1 w-full"
            type="text"
            value={inpValue}
            onChange={(e) => {
              setInpvalue(e.target.value);
            }}
            autoFocus
          />
        </form>
      )}
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
      {open && !isEditing && owner === current && (
        <div
          className="absolute -top-10 -right-28 flex flex-col p-3 gap-4 bg-dark-3"
          style={{ zIndex: 100 }}
        >
          <UpdateChat setEdit={setIsEditing} />
          <DeleteChat messageId={id} userId={current} chatId={chatId} />
        </div>
      )}
    </div>
  );
}
