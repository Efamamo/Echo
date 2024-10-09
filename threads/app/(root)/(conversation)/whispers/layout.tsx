import ItemList from '@/components/shared/item-lists/ItemList';
import React, { ReactNode } from 'react';

import ChatCard from '@/components/cards/ChatCard';
import Fallback from '@/components/shared/item-lists/whispers/Fallback';
import { fetchUser, fetchUserWhispers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user) return;

  const userInfo = await fetchUser(user.id);

  if (!userInfo.onBoarded) {
    redirect('/onboarding');
  }
  const whispers = await fetchUserWhispers(userInfo._id);

  return (
    <>
      <ItemList title="Whispers">
        {whispers.map((whisper) => {
          let recipent = whisper.userOne;
          if (userInfo._id.equals(whisper.userOne._id)) {
            recipent = whisper.userTwo;
          }

          return (
            <>
              <ChatCard
                id={whisper._id}
                key={whisper._id}
                image={recipent.image}
                name={recipent.name}
                lastMessage={whisper.lastMessage ? whisper.lastMessage : ''}
                current={userInfo._id}
              />
            </>
          );
        })}
      </ItemList>
      {children}
    </>
  );
}
