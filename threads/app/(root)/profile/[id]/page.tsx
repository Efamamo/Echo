import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { fetchUser, fetchUserById } from '@/lib/actions/user.actions';
import ProfileHeader from '@/components/shared/ProfileHeader';
export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUserById(params.id);

  if (!userInfo?.onBoarded) {
    redirect('/onboarding');
  }

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
    </section>
  );
}
