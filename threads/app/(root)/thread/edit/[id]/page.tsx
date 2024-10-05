import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';
import { fetchThreadById } from '@/lib/actions/thread.actions';
export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) {
    redirect('/onboarding');
  }

  const thread = await fetchThreadById(params.id);
  return (
    <>
      <h1 className="head-text">Edit Thread</h1>
      <PostThread
        userId={userInfo._id}
        threadId={params.id}
        type={'Edit'}
        text={thread.text}
      />
    </>
  );
}
