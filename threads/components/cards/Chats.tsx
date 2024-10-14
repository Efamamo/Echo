'use client';
import React, { useEffect } from 'react';
import ChatCard from './ChatCard';
import { pusherClient } from '@/lib/pusher';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMessage,
  initializeChats,
  seeLastMessage,
  updateLastMessge,
} from '@/state/store';

interface Whisper {
  userOne: any;
  lastMessage: {
    id: any;
    createdAt: any;
    content: any;
    seen: any;
    owner: any;
  } | null;
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

  // Create a new sorted array based on lastMessage.createdAt and lastMessage.id
  const sortedChats = [...incomingChats.chats].sort(
    (a: Whisper, b: Whisper) => {
      const lastMessageA = a.lastMessage;
      const lastMessageB = b.lastMessage;

      // Sort by lastMessage createdAt date, then by id
      const dateA = lastMessageA
        ? new Date(lastMessageA.createdAt)
        : new Date(0);
      const dateB = lastMessageB
        ? new Date(lastMessageB.createdAt)
        : new Date(0);

      // Compare dates first
      if (dateA < dateB) return 1; // Sort in descending order
      if (dateA > dateB) return -1;

      // If dates are the same, compare by lastMessage id
      const idA = lastMessageA ? lastMessageA.id : '';
      const idB = lastMessageB ? lastMessageB.id : '';

      return idB.localeCompare(idA); // Sort by id in descending order
    }
  );

  return (
    <>
      {sortedChats.map((whisper: Whisper) => {
        let recipent = whisper.userOne;
        if (userInfo._id.toString() === whisper.userOne.id) {
          recipent = whisper.userTwo;
        }

        return (
          <ChatCard
            id={whisper.id}
            key={whisper.id}
            image={recipent.image}
            name={recipent.name}
            lastMessage={whisper.lastMessage ? whisper.lastMessage : ''}
            current={userInfo._id.toString()}
          />
        );
      })}
    </>
  );
}

export default Chats;
