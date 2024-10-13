'use client';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for chats
const initialChatsState: { chats: any } = {
  chats: [],
};

const initialMessagesState: any = {
  chats: [],
};

// Create the chat slice with all reducers
const chatSlice = createSlice({
  name: 'chats',
  initialState: initialChatsState,
  reducers: {
    initializeChats: (state, action: PayloadAction<{ chats: any }>) => {
      const newChats = [];
      for (let chat of action.payload.chats) {
        const exist = state.chats.find((c: any) => c.id === chat.id);
        if (!exist) {
          newChats.push(chat);
        }
      }
      state.chats = [...state.chats, ...newChats];
    },
    updateLastMessge: (
      state,
      action: PayloadAction<{ chatId: any; lastMessage: any }>
    ) => {
      state.chats = state.chats.map((c: any) =>
        c.id === action.payload.chatId
          ? {
              ...c,
              lastMessage: action.payload.lastMessage,
            }
          : c
      );
    },
    seeLastMessage: (state, action: PayloadAction<{ messageId: any }>) => {
      state.chats = state.chats.map((c: any) =>
        c.lastMessage.id.toString() === action.payload.messageId
          ? {
              ...c,
              lastMessage: { ...c.lastMessage, seen: true },
            }
          : c
      );
    },
  },
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialMessagesState,
  reducers: {
    initializeMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: any }>
    ) => {
      const { chatId, messages } = action.payload;

      // Check if the chat already exists in the state
      const existingChat = state.chats.find(
        (chat: any) => chat.chatId === chatId
      );

      if (!existingChat) {
        // If it doesn't exist, create a new chat entry
        state.chats.push({ chatId, messages });
      }
    },

    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: any }>
    ) => {
      const { chatId, message } = action.payload;

      // Find the existing chat
      const chat = state.chats.find((chat: any) => chat.chatId === chatId);
      console.log(state.chats, chat, chatId);

      if (chat) {
        // If the chat exists, append the new message
        const chatMessages = [...chat.messages, message];
        state.chats = state.chats.map((chat: any) =>
          chat.chatId === chatId ? { ...chat, messages: chatMessages } : chat
        );
      } else {
        // If the chat does not exist, create a new chat entry with the message
        state.chats.push({ chatId, messages: [message] });
      }
    },
    seeMessage: (
      state,
      action: PayloadAction<{ chatId: string; messageId: any }>
    ) => {
      const chat = state.chats.find(
        (chat: any) => chat.chatId === action.payload.chatId
      );

      if (chat) {
        const chatMessages = chat.messages.map((message: any) =>
          message._id === action.payload.messageId
            ? { ...message, seen: true }
            : message
        );

        state.chats = state.chats.map((chat: any) =>
          chat.chatId === action.payload.chatId
            ? { ...chat, messages: chatMessages }
            : chat
        );
      }
    },
    deleteMessage: (
      state,
      action: PayloadAction<{ chatId: string; messageId: any }>
    ) => {
      const chat = state.chats.find(
        (chat: any) => chat.chatId === action.payload.chatId
      );

      const chatMessages = chat.messages.filter(
        (message: any) => message._id !== action.payload.messageId
      );

      state.chats = state.chats.map((chat: any) =>
        chat.chatId === action.payload.chatId
          ? { ...chat, messages: chatMessages }
          : chat
      );
    },
    updateMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: any }>
    ) => {
      const chat = state.chats.find(
        (chat: any) => chat.chatId === action.payload.chatId
      );

      const chatMessages = chat.messages.map((m: any) =>
        m._id === action.payload.message._id
          ? { ...m, ...action.payload.message }
          : m
      );

      state.chats = state.chats.map((chat: any) =>
        chat.chatId === action.payload.chatId
          ? { ...chat, messages: chatMessages }
          : chat
      );
    },
  },
});

// Configure the Redux store
export const store = configureStore({
  reducer: {
    chats: chatSlice.reducer,
    messages: messagesSlice.reducer,
  },
});

// Export actions and types
export const { initializeChats, updateLastMessge, seeLastMessage } =
  chatSlice.actions;

export const {
  initializeMessages,
  addMessage,
  seeMessage,
  updateMessage,
  deleteMessage,
} = messagesSlice.actions;
