'use client';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/thread';
import { addCommentToThread, createThread } from '@/lib/actions/thread.actions';
import { Input } from '../ui/input';
import Image from 'next/image';
// import { updateUser } from '@/lib/actions/user.actions';

interface Props {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}
export default function Comment({
  threadId,
  currentUserImage,
  currentUserId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center w-full gap-4">
              <FormLabel>
                <Image
                  className="rounded-full object-cover"
                  src={currentUserImage}
                  alt="profile image"
                  width={48}
                  height={48}
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  className="no-focus text-light-1 outline-none"
                  placeholder="Comment..."
                  type="text"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}
