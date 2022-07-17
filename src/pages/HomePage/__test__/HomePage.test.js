// jshint esversion:9
import { fireEvent, render, screen } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProviderWrapper } from '../../../context/auth.context';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { HomePage } from '../HomePage';

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

jest.mock('../../../redux/hooks/redux-hooks');

describe('ShopItem', () => {
  /* it('should not render shop-items-container', async () => {
    render(<MockHomePage />);
    const itemsContainer = screen.queryByTestId(/shop-items-container/i);
    expect(itemsContainer).not.toBeInTheDocument();
  });
 */

  it('should render shop-items-container', async () => {
    render(<MockHomePage />);
    const itemsContainer = await screen.findByTestId(/shop-items-container/i);
    screen.debug();
    expect(itemsContainer).toBeInTheDocument();
  });

  /* 
  it('should render first item in shop-items-container', async () => {
    render(<MockHomePage />);
    const itemElement = await screen.findByTestId('shop-item-2');
    expect(itemElement).toBeInTheDocument();
  });
 */
  /* it('should render item in shop-items-container', async () => {
    render(<MockHomePage />);

    const itemElement = await screen.findByTestId('shop-item-1');
    expect(itemElement).toBeInTheDocument();
  }); */
});
