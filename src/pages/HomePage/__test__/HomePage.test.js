// jshint esversion:9
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProviderWrapper } from '../../../context/auth.context';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { HomePage } from '../HomePage';
import { server, rest } from '../../../mocks/server';

const MockHomePage = () => {
  return (
    <Router>
      <AuthProviderWrapper>
        <Provider store={store}>
          <HomePage />
        </Provider>
      </AuthProviderWrapper>
    </Router>
  );
};

// stops error from the window.scrollTo that i have in the component
global.scrollTo = jest.fn();

describe('HomePage', () => {
  it('should render items container', async () => {
    render(<MockHomePage />);

    const itemsContainer = await screen.findByTestId('shop-items-container');

    expect(itemsContainer).toBeInTheDocument();
  });
});
