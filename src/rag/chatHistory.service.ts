import { Content } from '@google/genai';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

interface ChatsStorage {
  id: string;
  history: any[];
}

@Injectable()
export class ChatHistoryService {
  private chats: ChatsStorage[] = [];
  constructor() {}

  isChatExist(chatId: string) {
    const chat = this.chats.find((chat) => chat.id === chatId);
    return chat ? true : false;
  }

  saveChatHistory(chatId: string, history: Content[]) {
    const chatData = {
      id: chatId,
      history: history,
    };
    this.chats.push(chatData);
  }

  updateChatHistory(chatId: string, history: Content[]) {
    const updatedChat = this.chats.find((chat) => chat.id === chatId);
    updatedChat.history = history;
  }

  getChatById(chatId: string) {
    const chat = this.chats.find((chat) => chat.id === chatId);
    return chat;
  }
}
