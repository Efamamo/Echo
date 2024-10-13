'use client';
import { Provider } from 'react-redux';
import Messages from './Messages';
import { store } from '@/state/store';

interface Msg {
  _id: string;
  owner: string;
  time: any;
  content: string;
}

export default function ShowMessages({
  userId,
  chatId,
  messages,
}: {
  userId: string;
  chatId: string;
  messages: Msg[];
}) {
  return (
    <Provider store={store}>
      <Messages userId={userId} chatId={chatId} messages={messages} />
    </Provider>
  );
}
