import Image from 'next/image';
import { useEffect } from 'react';

export default function SearchBar({
  searchString,
  setSearch,
  submit,
}: {
  searchString: string;
  setSearch: (st: any) => void;
  submit: (st: any) => void;
}) {
  return (
    <form
      onSubmit={(e: any) => {
        e.preventDefault();
        submit(searchString);
      }}
      className="flex gap-4 items-center mb-4 p-3 bg-dark-2 rounded-lg"
    >
      <Image
        src="/assets/search.svg"
        alt="search-icon"
        width={24}
        height={24}
      />
      <input
        onChange={(e: any) => {
          setSearch(e.target.value);
        }}
        type="text"
        name=""
        id=""
        placeholder="Search users..."
        className="text-light-1 bg-dark-2 w-full border-none outline-none"
      />
    </form>
  );
}
