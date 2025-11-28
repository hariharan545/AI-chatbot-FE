import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import { App } from '../App';

describe('App', () => {
  it('renders login by default when not authenticated', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/Real-Time AI Chat/i)).toBeInTheDocument();
  });
});


