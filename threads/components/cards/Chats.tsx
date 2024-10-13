'use client';
import React, { useEffect, useState } from 'react';
import ChatCard from './ChatCard';
import { pusherClient } from '@/lib/pusher';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeChats,
  seeLastMessage,
  updateLastMessge,
} from '@/state/store';

interface Whisper {
  userOne: any;
  lastMessage:
    | {
        id: any;
        createdAt: any;
        content: any;
        seen: any;
        owner: any;
      }
    | any;
  userTwo: any;
  id: string;
}

function Chats({ chats, userInfo }: { chats: Whisper[]; userInfo: any }) {
  const incomingChats = useSelector((state: any) => state.chats);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeChats({ chats }));
    pusherClient.subscribe(userInfo._id.toString());

    pusherClient.bind('incoming-chat', (chat: any) => {
      dispatch(
        updateLastMessge({ chatId: chat.id, lastMessage: chat.lastMessage })
      );
    });

    pusherClient.bind(
      'message-seen',
      (data: { messageId: string; seen: boolean }) => {
        dispatch(seeLastMessage({ messageId: data.messageId }));
      }
    );
  }, [chats, dispatch]);

  return (
    <>
      {incomingChats.chats.map((whisper: any) => {
        let recipent = whisper.userOne;
        if (userInfo._id.toString() === whisper.userOne.id) {
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
    </>
  );
}

export default Chats;
