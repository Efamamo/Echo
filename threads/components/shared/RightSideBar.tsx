import { fetchSuggestedUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import UserCard from '../cards/UserCard';

export default async function RightSideBar() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }
  const suggestedUser = await fetchSuggestedUsers(user?.id);
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex  flex-1 flex-col justify-start items-center gap-6 px-6">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        {suggestedUser.map((user) => (
          <UserCard
            id={user.id}
            name={user.name}
            username={user.username}
            imageUrl={user.image}
            personType="User"
          />
        ))}
      </div>
      <div className="flex  flex-1 flex-col items-center justify-start gap-6 px-6">
        <h3 className="text-heading4-medium text-light-1">Suggested Chorus</h3>
      </div>
    </section>
  );
}
