'use client';

import { usePathname } from 'next/navigation';
import { repostThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RepostEcho({
  text,
  author,
  originalThread,
}: {
  text: string;
  author: string;
  originalThread: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const onSubmit = async () => {
    await repostThread({
      text,
      author,
      communityId: null,
      path: pathname,
      originalThread,
    });
    router.push('/');
  };

  return (
    <Image
      src="/assets/repost.svg"
      alt="repost"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={onSubmit}
      title="repost"
    />
  );
}
