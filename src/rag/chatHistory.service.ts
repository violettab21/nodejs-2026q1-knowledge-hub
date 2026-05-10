import { Content } from '@google/genai';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

interface ChatsStorage {
  id: string;
  history: any[];
}

const MAX_MESSAGES = Number(process.env.RAG_CONVERSATION_MAX_MESSAGES) || 20;

@Injectable()
export class ChatHistoryService {
  private chats: ChatsStorage[] = [];
  constructor() {}

  isChatExist(chatId: string) {
    const chat = this.chats.find((chat) => chat.id === chatId);
    return chat ? true : false;
  }

  saveChatHistory(chatId: string, history: Content[]) {
    const limitedHistory =
      history.length <= MAX_MESSAGES
        ? history
        : history.slice(history.length - MAX_MESSAGES);
    const chatData = {
      id: chatId,
      history: limitedHistory,
    };
    this.chats.push(chatData);
  }

  updateChatHistory(chatId: string, history: Content[]) {
    const limitedHistory =
      history.length <= MAX_MESSAGES
        ? history
        : history.slice(history.length - MAX_MESSAGES);
    const updatedChat = this.chats.find((chat) => chat.id === chatId);
    updatedChat.history = limitedHistory;
  }

  getChatById(chatId: string) {
    const chat = this.chats.find((chat) => chat.id === chatId);
    return chat;
  }
}
