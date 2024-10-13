'use client';
import { Provider } from 'react-redux';
import Chats from './Chats';
import { store } from '@/state/store';

interface Whisper {
  userOne: any;
  lastMessage:
    | {
        createdAt: any;
        content: any;
        seen: any;
        owner: any;
      }
    | any;
  userTwo: any;
  id: string;
}

function ShowChats({ chats, userInfo }: { chats: Whisper[]; userInfo: any }) {
  return (
    <Provider store={store}>
      <Chats chats={chats} userInfo={userInfo} />
    </Provider>
  );
}

export default ShowChats;
