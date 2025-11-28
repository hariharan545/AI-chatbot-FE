import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { chatActions } from '../features/chat/chatSlice';
import { websocketActions } from '../features/chat/chatSlice';

export const ChatScreen = () => {
  const dispatch = useAppDispatch();
  const { messages, typing, wsConnected } = useAppSelector((s) => s.chat);
  const user = useAppSelector((s) => s.auth.user);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(websocketActions.connect());
    return () => {
      dispatch(websocketActions.disconnect());
    };
  }, [dispatch]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch(chatActions.sendUserMessageRequested({ text: input.trim() }));
    setInput('');
  };

  return (
    <div className="page chat-page">
      <div className="chat-widget">
        <header className="widget-header">
          <div className="bot-meta">
            <div className="bot-avatar">
              <span role="img" aria-label="ticket">
                ✉️
              </span>
            </div>
            <div>
              <div className="bot-name">AI Bot</div>
              <div className="bot-status">
                <span className={`dot ${wsConnected ? 'online' : 'offline'}`} />
                {wsConnected ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
          {user && (
            <div className="widget-user">
              {user.photo && <img src={user.photo} alt={user.name} />}
              <span>{user.name}</span>
            </div>
          )}
        </header>

        <div className="widget-body" ref={listRef}>
          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.sender}`}>
              {m.text}
            </div>
          ))}
          {typing && <div className="typing">AI Bot is typing…</div>}
        </div>

        <form className="widget-footer" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here"
          />
          <button type="submit" aria-label="Send message">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};


