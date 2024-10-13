import ItemList from '@/components/shared/item-lists/ItemList';
import React, { ReactNode } from 'react';
import { fetchUser, fetchUserWhispers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Chats from '@/components/cards/Chats';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import ShowChats from '@/components/cards/ShowChats';

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user) return;

  const userInfo = await fetchUser(user.id);

  if (!userInfo.onBoarded) {
    redirect('/onboarding');
  }
  const whispers = await fetchUserWhispers(userInfo._id);

  const chats = whispers.map((whisper) => ({
    userOne: {
      name: whisper.userOne.name,
      image: whisper.userOne.image,
      id: whisper.userOne._id.toString(),
    },
    lastMessage: {
      id: whisper.lastMessage._id,
      createdAt: whisper.lastMessage.createdAt,
      content: whisper.lastMessage.content,
      seen: whisper.lastMessage.seen,
      owner: whisper.lastMessage.owner,
    },
    userTwo: {
      name: whisper.userTwo.name,
      image: whisper.userTwo.image,
      id: whisper.userTwo._id.toString(),
    },
    id: whisper._id.toString(),
  }));

  return (
    <>
      <ItemList title="Whispers">
        <ShowChats chats={chats} userInfo={userInfo} />
      </ItemList>
      {children}
    </>
  );
}
