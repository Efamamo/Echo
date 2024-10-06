'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { deleteThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { react } from '@/lib/actions/like.actions';
import { tuneIn } from '@/lib/actions/user.actions';

export default function TuneIn({
  recipentId,
  userId,
}: {
  recipentId: string;
  userId: string;
}) {
  const pathname = usePathname();

  const onSubmit = async () => {
    await tuneIn(userId, recipentId, pathname);
  };

  return (
    <Image
      src="/assets/tunein.svg"
      alt="follow icon"
      width={30}
      height={30}
      className="cursor-pointer"
      onClick={onSubmit}
    />
  );
}
