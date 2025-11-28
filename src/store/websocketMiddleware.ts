import type { Middleware } from '@reduxjs/toolkit';
import { websocketActions, chatActions } from '../features/chat/chatSlice';

const WS_URL = (import.meta as any).env.VITE_WS_URL || 'ws://localhost:4000/ws/chat';

let socket: WebSocket | null = null;

export const websocketMiddleware: Middleware = (store) => (next) => (action) => {
  if (websocketActions.connect.match(action)) {
    if (socket) {
      socket.close();
    }
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      store.dispatch(websocketActions.connected());
    };
    socket.onclose = () => {
      store.dispatch(websocketActions.disconnected());
    };
    socket.onerror = () => {
      store.dispatch(websocketActions.error('WebSocket error'));
    };
    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'bot_token') {
          store.dispatch(
            chatActions.botMessageTokenReceived({
              id: msg.payload.id,
              token: msg.payload.token
            })
          );
        } else if (msg.type === 'bot_complete') {
          store.dispatch(chatActions.botMessageCompleted());
        }
        store.dispatch(websocketActions.messageReceived(event.data));
      } catch {
        store.dispatch(websocketActions.messageReceived(event.data));
      }
    };
  } else if (websocketActions.disconnect.match(action)) {
    socket?.close();
    socket = null;
  } else if (websocketActions.sendMessage.match(action)) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'user_message', payload: action.payload }));
    }
  }

  return next(action);
};


