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
import { Textarea } from '../ui/textarea';
import { useOrganization } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread, updateThread } from '@/lib/actions/thread.actions';
// import { updateUser } from '@/lib/actions/user.actions';

export default function PostThread({
  userId,
  type,
  text,
  threadId,
}: {
  userId: string;
  type: 'Edit' | 'Add';
  text?: string;
  threadId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: text || '',
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    if (type === 'Add') {
      await createThread({
        text: values.thread,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
      });
      router.push('/');
    } else {
      await updateThread({
        id: threadId || '',
        text: values.thread,
        author: userId,
        path: pathname,
      });
      router.push(`/thread/${threadId}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="lex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-4 mb-8">
              <FormLabel className="text-base-semibold text-light-2  gap-1">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 w-full">
          {type === 'Add' ? 'Post Thread' : 'Edit Thread'}
        </Button>
      </form>
    </Form>
  );
}
