'use client';

import { useEffect, useState } from 'react';
import Message from './Message';
import { pusherClient } from '@/lib/pusher';

interface Msg {
  _id: string;
  owner: string;
  time: any;
  content: string;
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
  console.log(chatId);
  const [incomingMessages, setIncomingMessages] = useState<Msg[]>(messages);

  useEffect(() => {
    // Subscribe to the chat channel
    pusherClient.subscribe(chatId);

    // Listen for incoming messages
    pusherClient.bind('incoming-message', (message: Msg) => {
      setIncomingMessages((prev) => {
        return [...prev, message];
      });
    });

    // Listen for message seen event
    pusherClient.bind(
      'message-seen',
      (data: { messageId: string; seen: boolean }) => {
        setIncomingMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === data.messageId ? { ...msg, seen: data.seen } : msg
          )
        );
      }
    );

    // Listen for incoming messages
    pusherClient.bind('delete-message', (data: { messageId: string }) => {
      setIncomingMessages(
        (prev) => prev.filter((m) => m._id !== data.messageId) // Filter out the message with the matching _id
      );
    });

    pusherClient.bind('update-message', (message: Msg) => {
      setIncomingMessages((prevMessages) =>
        prevMessages.map((m) =>
          m._id === message._id ? { ...m, ...message } : m
        )
      );
    });

    // Cleanup on unmount
    return () => {
      pusherClient.unsubscribe(chatId);
    };
  }, [chatId]);

  // Remove duplicate messages by using a Set or filtering
  const uniqueMessages = Array.from(
    new Set(incomingMessages.map((message) => message._id))
  ).map((id) => incomingMessages.find((message) => message._id === id));

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
