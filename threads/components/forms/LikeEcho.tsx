'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { deleteThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { react } from '@/lib/actions/like.actions';

export default function LikeEcho({
  threadId,
  userId,
  hasLiked,
}: {
  threadId: string;
  userId: string;
  hasLiked: boolean;
}) {
  const pathname = usePathname();

  const onSubmit = async () => {
    await react(userId, threadId, pathname);
  };

  return (
    <Image
      src={hasLiked ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={onSubmit}
    />
  );
}
