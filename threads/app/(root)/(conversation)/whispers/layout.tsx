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

  const chats = whispers.map((whisper) => ({
    userOne: whisper.userOne,
    lastMessage: {
      createdAt: whisper.lastMessage.createdAt,
      content: whisper.lastMessage.content,
      seen: whisper.lastMessage.seen,
      owner: whisper.lastMessage.owner,
    },
    userTwo: whisper.userTwo,
    id: whisper._id.toString(),
  }));

  return (
    <>
      <ItemList title="Whispers">
        {chats.map((whisper) => {
          let recipent = whisper.userOne;
          if (userInfo._id.toString() === whisper.userOne._id.toString()) {
            recipent = whisper.userTwo;
          }

          return (
            <>
              <ChatCard
                id={whisper.id}
                key={whisper.id}
                image={recipent.image}
                name={recipent.name}
                lastMessage={whisper.lastMessage ? whisper.lastMessage : ''}
                current={userInfo._id.toString()}
              />
            </>
          );
        })}
      </ItemList>
      {children}
    </>
  );
}
