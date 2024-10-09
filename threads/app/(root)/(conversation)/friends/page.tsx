import ItemList from '@/components/shared/item-lists/ItemList';
import Fallback from '@/components/shared/item-lists/whispers/Fallback';
import { fetchUserFriends } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';

export default async function page() {
  const user = await currentUser();

  if (!user) return null;
  const friends = await fetchUserFriends(user.id);
  console.log(friends[0].name);

  return (
    <>
      <ItemList title="Friends">
        <p className="text-light-1">{friends[0].name}</p>
      </ItemList>
      <Fallback />
    </>
  );
}
