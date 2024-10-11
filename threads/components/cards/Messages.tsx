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
  const [incomingMessages, setIncomingMessages] = useState<Msg[]>([]);

  useEffect(() => {
    // Subscribe to the chat channel
    pusherClient.subscribe(chatId);

    // Listen for incoming messages
    pusherClient.bind('incoming-message', (message: Msg) => {
      console.log('Incoming message:', message);
      setIncomingMessages((prev) => {
        // Check if the message already exists in the state
        if (prev.find((msg) => msg._id === message._id)) {
          return prev;
        }
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

    // Cleanup on unmount
    return () => {
      pusherClient.unsubscribe(chatId);
    };
  }, [chatId]);

  // Combine existing messages with incoming messages

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

      {messages.map((message: any) => (
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
