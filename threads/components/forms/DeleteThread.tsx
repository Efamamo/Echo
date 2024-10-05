'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { deleteThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DeleteThread({ threadId }: { threadId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    await deleteThread(threadId, pathname);
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button className="p-0 m-0 bg-transparent h-0" type="submit">
        <Image src="/assets/delete.svg" alt="delete" width={18} height={24} />
      </Button>
    </form>
  );
}
