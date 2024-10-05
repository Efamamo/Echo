import Image from 'next/image';

interface SearchProps {
  searchString: string;
  setSearchString: (e: any) => void;
  submit: () => void;
  placeHolder: string;
}

export default function SearchBar({
  searchString,
  setSearchString,
  submit,
  placeHolder,
}: SearchProps) {
  function handleSubmit(e: any) {
    e.preventDefault();
    submit();
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-center mb-4 py-3 px-4 bg-dark-2 rounded-xl"
    >
      <Image
        src="/assets/search.svg"
        alt="search-icon"
        width={24}
        height={24}
      />
      <input
        onChange={(e: any) => {
          setSearchString(e.target.value);
        }}
        type="text"
        name=""
        id=""
        placeholder={`Search ${placeHolder}...`}
        className="text-light-1 bg-dark-2 w-full border-none outline-none"
      />
    </form>
  );
}
