import AccountProfile from '@/components/forms/AccountProfile';
import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/lib/actions/user.actions';

export default async function Onboarding() {
  const user = await currentUser();

  const userData = {
    id: user?.id || '',
    objectId: user?.id || '',
    username: user?.username || '',
    name: user?.firstName || '',
    bio: '',
    image: user?.imageUrl || '',
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete Your Profile to use Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}
