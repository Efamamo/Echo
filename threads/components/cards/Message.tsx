import { markMessageAsSeen } from '@/lib/actions/user.actions';
import Image from 'next/image';

export default async function Message({
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
  const date = new Date(time);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const t = date.toLocaleString('en-US', options);

  await markMessageAsSeen(id, current, chatId);

  return (
    <div
      className={`max-w-64 justify-start rounded-full  bg-dark-4 ${
        !owner.equals(current)
          ? 'ml-auto justify-end rounded-tr-none'
          : 'rounded-tl-none mr-auto bg-[#1f2e50]'
      } flex items-end gap-2 py-2 px-4  m-2`}
    >
      <h3>{content}</h3>
      <div
        className={`flex items-center gap-0.5 ${
          owner.equals(current) ? 'relative top-0.5' : ''
        }`}
      >
        <p className="text-gray-400" style={{ fontSize: '10px' }}>
          {t}
        </p>
        {owner.equals(current) && !seen && (
          <Image src="/assets/single.svg" alt="seen" width={20} height={20} />
        )}
        {owner.equals(current) && seen && (
          <Image src="/assets/tick.svg" alt="seen" width={20} height={20} />
        )}
      </div>
    </div>
  );
}
