'use client';
import React, { ChangeEvent, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthings';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  id: string;
  objectId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}

export default function AccountProfile({
  user,
  btnTitle,
}: {
  user: Props;
  btnTitle: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media');
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user.image || '',
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
    },
  });

  function handleImage(
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes('image')) return;

      setFiles(Array.from(e.target.files));

      fileReader.onload = async (event) => {
        const imageUrl = event.target?.result?.toString() || '';
        fieldChange(imageUrl);
      };
      fileReader.readAsDataURL(file);
    }
  }

  async function onSubmit(values: z.infer<typeof UserValidation>) {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });

    if (pathname === '/profile/edit') {
      router.back();
    } else {
      router.push('/');
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="lex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4 mb-8">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile picture"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile picture"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload Photo"
                  className="account-form_image-input"
                  onChange={(e) => {
                    handleImage(e, field.onChange);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-4 mb-8">
              <FormLabel className="text-base-semibold text-light-2  gap-1">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-4 mb-8">
              <FormLabel className="text-base-semibold text-light-2  gap-3">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4 mb-8">
              <FormLabel className="text-base-semibold text-light-2  gap-3">
                Bio
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-purple-500 w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
