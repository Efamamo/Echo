import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostEcho';
export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) {
    redirect('/onboarding');
  }
  return (
    <>
      <h1 className="head-text">Create Echo</h1>
      <PostThread userId={userInfo._id} type="Add" />
    </>
  );
}
