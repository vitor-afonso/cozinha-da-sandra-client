// jshint esversion:9
import { fireEvent, render, screen } from '@testing-library/react';
import { ShopItem } from '../ShopItem';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProviderWrapper } from '../../../context/auth.context';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

const MockShopItem = ({ name, price, imageUrl }) => {
  return (
    <Router>
      <AuthProviderWrapper>
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
    const imgElement = screen.getByRole('img');

    expect(imgElement).toBeInTheDocument();
  });

  it('should render element with same name as passed as prop', async () => {
    render(<MockShopItem name='Bolo de chocolate' />);
    const titleElement = screen.getByText(/bolo de chocolate/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('should render element with same price as passed as prop', async () => {
    render(<MockShopItem price={11.99} />);
    const priceElement = screen.getByText(/€/i);
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

  /* it('should render decrease element', async () => {
    render(<MockShopItem isLoggedIn={true} />);
    const decreaseButtonElement = await screen.findByRole('button', { name: 'decrease' });
    expect(decreaseButtonElement).toBeInTheDocument();
  }); */

  it('should render 3 link elements', async () => {
    render(<MockShopItem />);
    const linkElements = screen.queryAllByRole('link');
    expect(linkElements.length).toBe(3);
  });

  it('should render span with textContent "Adicionar ao carrinho"', async () => {
    render(<MockShopItem />);
    const spanElement = screen.getByText(/Adicionar ao carrinho/i);
    expect(spanElement).toBeInTheDocument();
  });

  it('should render link that contains href of "/login"', async () => {
    render(<MockShopItem />);
    const linkElement = screen.getByTestId('go-to-login');
    expect(linkElement).toHaveAttribute('href', '/login');
  });
});
