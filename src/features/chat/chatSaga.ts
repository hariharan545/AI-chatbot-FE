import { eventChannel } from 'redux-saga';
import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import { chatActions, Message } from './chatSlice';
import type { RootState } from '../../store';

function createMessageId() {
  return Math.random().toString(36).slice(2);
}

function* handleSendUserMessage(action: ReturnType<typeof chatActions.sendUserMessageRequested>) {
  const id = createMessageId();
  const message: Message = {
    id,
    sender: 'user',
    text: action.payload.text,
    timestamp: new Date().toISOString()
  };

  yield put(chatActions.userMessageAdded(message));

  // WebSocket send is handled by middleware; here we just keep saga responsible for side effects
}

function createTypingChannel() {
  return eventChannel((emit) => {
    const interval = setInterval(() => emit(null), 3000);
    return () => clearInterval(interval);
  });
}

function* typingIndicatorFlow() {
  const channel: ReturnType<typeof createTypingChannel> = yield call(createTypingChannel);
  while (true) {
    yield take(channel);
    const streaming: boolean = yield select((s: RootState) => s.chat.streaming);
    if (!streaming) {
      break;
    }
  }
}

export default function* chatSaga() {
  yield takeEvery(chatActions.sendUserMessageRequested.type, handleSendUserMessage);
  yield takeEvery(chatActions.sendUserMessageRequested.type, typingIndicatorFlow);
}


