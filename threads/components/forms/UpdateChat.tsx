import Image from 'next/image';
import React from 'react';

function UpdateChat({ setEdit }: { setEdit: (val: boolean) => void }) {
  return (
    <div
      className="flex hover:bg-dark-3 gap-2 p-2 cursor-pointer"
      onClick={() => {
        setEdit(true);
      }}
    >
      <Image src="/assets/edit.svg" alt="delete" width={15} height={15} />
      <p className="text-light-1 text-small-regular">Edit</p>
    </div>
  );
}

export default UpdateChat;
