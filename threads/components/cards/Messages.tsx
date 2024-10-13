'use client';

import { useEffect } from 'react';
import Message from './Message';
import { pusherClient } from '@/lib/pusher';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMessage,
  deleteMessage,
  initializeMessages,
  seeMessage,
  updateMessage,
} from '@/state/store';

interface Msg {
  _id: string;
  owner: string;
  createdAt: string; // Assuming createdAt is a string
  content: string;
  seen?: boolean; // Optional
}

export default function Messages({
  userId,
  chatId,
  messages,
}: {
  userId: string;
  chatId: string;
  messages: Msg[];
}) {
  const dispatch = useDispatch();
  const incomingChats = useSelector((state: any) => state.messages.chats);

  useEffect(() => {
    dispatch(initializeMessages({ chatId, messages }));

    // Subscribe to the chat channel
    pusherClient.subscribe(chatId);

    // Listen for incoming messages
    const handleIncomingMessage = (message: Msg) => {
      dispatch(addMessage({ chatId, message }));
    };

    pusherClient.bind('incoming-message', handleIncomingMessage);

    // Listen for message seen event
    pusherClient.bind(
      'message-seen',
      (data: { messageId: string; seen: boolean }) => {
        dispatch(seeMessage({ chatId, messageId: data.messageId }));
      }
    );

    // Listen for delete message event
    pusherClient.bind('delete-message', (data: { messageId: string }) => {
      dispatch(deleteMessage({ chatId, messageId: data.messageId }));
    });

    // Listen for update message event
    pusherClient.bind('update-message', (message: Msg) => {
      dispatch(updateMessage({ chatId, message }));
    });

    // Cleanup on unmount
    return () => {
      pusherClient.unbind('incoming-message', handleIncomingMessage);
      pusherClient.unsubscribe(chatId);
    };
  }, [chatId, dispatch, messages, incomingChats]);

  const incomingChat = incomingChats.find(
    (chat: any) => chat.chatId === chatId
  );

  const uniqueMessages = Array.from(
    new Set(incomingChat?.messages.map((message: any) => message._id))
  ).map((id) =>
    incomingChat?.messages.find((message: any) => message._id === id)
  );

  const sortedMessages = uniqueMessages.sort((a: any, b: any) => {
    const timeComparison =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return timeComparison !== 0 ? timeComparison : b._id.localeCompare(a._id);
  });

  return (
    <>
      {sortedMessages.map((message: any) => (
        <Message
          key={message._id} // Ensure this is unique
          content={message.content}
          time={message.createdAt}
          owner={message.owner}
          current={userId}
          id={message._id}
          chatId={chatId}
          seen={message.seen}
        />
      ))}
    </>
  );
}
