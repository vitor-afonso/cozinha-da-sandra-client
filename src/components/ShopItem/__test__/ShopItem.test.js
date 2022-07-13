// jshint esversion:9
import { render, screen } from '@testing-library/react';
import { ShopItem } from '../ShopItem';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProviderWrapper } from '../../../context/auth.context';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

const MockShopItem = ({ name, price, imageUrl }) => {
  return (
    <Router>
      <AuthProviderWrapper isLoggedIn={false}>
        <Provider store={store}>
          <ShopItem name={name} price={price} imageUrl={imageUrl} />
        </Provider>
      </AuthProviderWrapper>
    </Router>
  );
};

describe('ShopItem', () => {
  it('should render img element', async () => {
    render(<MockShopItem imageUrl='imageUrl' />);
    const imgElement = await screen.findByRole('img');
    expect(imgElement).toBeInTheDocument();
  });

  it('should render element with same name as passed as prop', async () => {
    render(<MockShopItem name='Bolo de chocolate' />);
    const titleElement = await screen.findByText(/bolo de chocolate/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('should render element with same price as passed as prop', async () => {
    render(<MockShopItem price={11.99} />);
    const priceElement = await screen.findByText(/€/i);
    expect(priceElement.textContent).toBe('11.99€');
  });

  it('should not render increase element', async () => {
    render(<MockShopItem />);
    const increaseButtonElement = screen.queryByRole('button', { name: 'increase' });
    expect(increaseButtonElement).not.toBeInTheDocument();
  });

  it('should not render decrease element', async () => {
    render(<MockShopItem />);
    const decreaseButtonElement = screen.queryByRole('button', { name: 'decrease' });
    expect(decreaseButtonElement).not.toBeInTheDocument();
  });

  it('should render 3 link elements', async () => {
    render(<MockShopItem />);
    const linkElements = screen.queryAllByRole('link');
    expect(linkElements.length).toBe(3);
  });
});
