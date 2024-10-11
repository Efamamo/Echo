import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

function DeleteChat({
  messageId,
  userId,
  chatId,
}: {
  messageId: string;
  userId: string;
  chatId: string;
}) {
  const path = usePathname();
  async function deleteM() {}
  return (
    <div
      onClick={deleteM}
      className="flex hover:bg-dark-3 gap-2 p-2 cursor-pointer"
    >
      <Image src="/assets/delete.svg" alt="delete" width={15} height={15} />
      <p className="text-light-1 text-small-regular">Delete</p>
    </div>
  );
}

export default DeleteChat;
