import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Sender = 'user' | 'bot';

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  currentBotMessageId: string | null;
  streaming: boolean;
  wsConnected: boolean;
  typing: boolean;
}

const initialState: ChatState = {
  messages: [],
  currentBotMessageId: null,
  streaming: false,
  wsConnected: false,
  typing: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendUserMessageRequested(state, _action: PayloadAction<{ text: string }>) {
      state.streaming = true;
      state.typing = true;
    },
    userMessageAdded(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    botMessageTokenReceived(state, action: PayloadAction<{ id: string; token: string }>) {
      const { id, token } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) {
        msg.text += token;
      } else {
        state.messages.push({
          id,
          sender: 'bot',
          text: token,
          timestamp: new Date().toISOString()
        });
      }
      state.currentBotMessageId = id;
    },
    botMessageCompleted(state) {
      state.streaming = false;
      state.typing = false;
      state.currentBotMessageId = null;
    },
    clearChat(state) {
      state.messages = [];
    },
    connectWebsocket() {},
    disconnectWebsocket() {},
    websocketConnected(state) {
      state.wsConnected = true;
    },
    websocketDisconnected(state) {
      state.wsConnected = false;
    },
    websocketMessageReceived(_state, _action: PayloadAction<string>) {},
    websocketError(state, _action: PayloadAction<string>) {
      state.wsConnected = false;
    }
  }
});

export const chatActions = chatSlice.actions;

export const websocketActions = {
  connect: chatSlice.actions.connectWebsocket,
  connected: chatSlice.actions.websocketConnected,
  disconnect: chatSlice.actions.disconnectWebsocket,
  disconnected: chatSlice.actions.websocketDisconnected,
  messageReceived: chatSlice.actions.websocketMessageReceived,
  sendMessage: chatSlice.actions.sendUserMessageRequested,
  error: chatSlice.actions.websocketError
};

export default chatSlice.reducer;


