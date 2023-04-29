import React, { lazy } from 'react';

import { IsUser } from 'components/IsUser';
import { IsAdmin } from 'components/IsAdmin';
import { IsOrderOwner } from 'components/IsOrderOwner';

const SignupPage = lazy(() => import('pages/SignupPage'));
const LoginPage = lazy(() => import('pages/LoginPage'));
const ForgotPage = lazy(() => import('pages/ForgotPage'));
const ResetPage = lazy(() => import('pages/ResetPage'));
const SendEmailPage = lazy(() => import('pages/SendEmailPage'));
const HomePage = lazy(() => import('pages/HomePage'));
const DocesPage = lazy(() => import('pages/DocesPage'));
const SalgadosPage = lazy(() => import('pages/SalgadosPage'));
const ItemDetailsPage = lazy(() => import('pages/ItemDetailsPage'));
const NewItemPage = lazy(() => import('pages/NewItemPage'));
const EditItemPage = lazy(() => import('pages/EditItemPage'));
const UsersPage = lazy(() => import('pages/UsersPage'));
const OrdersPage = lazy(() => import('pages/OrdersPage'));
const EditOrderPage = lazy(() => import('pages/EditOrderPage'));
const ProfilePage = lazy(() => import('pages/ProfilePage'));
const EditProfilePage = lazy(() => import('pages/EditProfilePage'));
const CartPage = lazy(() => import('pages/CartPage'));
const AboutPage = lazy(() => import('pages/AboutPage'));
const CreateReviewPage = lazy(() => import('pages/CreateReviewPage'));

const useAppRoutes = () => {
  const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/login/:orderId?', element: <LoginPage /> },
    { path: '/doces', element: <DocesPage /> },
    { path: '/salgados', element: <SalgadosPage /> },
    { path: '/items/:itemId', element: <ItemDetailsPage /> },
    { path: '/cart', element: <CartPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/forgot', element: <ForgotPage /> },
    { path: '/reset/:userId', element: <ResetPage /> },
    {
      path: '/profile/:userId',
      element: (
        <IsUser>
          <ProfilePage />
        </IsUser>
      ),
    },
    {
      path: '/profile/edit/:userId',
      element: (
        <IsUser>
          <EditProfilePage />
        </IsUser>
      ),
    },
    {
      path: '/orders/edit/:orderId',
      element: (
        <IsUser>
          <EditOrderPage />
        </IsUser>
      ),
    },
    {
      path: '/users',
      element: (
        <IsAdmin>
          <UsersPage />
        </IsAdmin>
      ),
    },
    {
      path: '/orders',
      element: (
        <IsAdmin>
          <OrdersPage />
        </IsAdmin>
      ),
    },
    {
      path: '/items/add',
      element: (
        <IsAdmin>
          <NewItemPage />
        </IsAdmin>
      ),
    },
    {
      path: '/items/edit/:itemId',
      element: (
        <IsAdmin>
          <EditItemPage />
        </IsAdmin>
      ),
    },
    {
      path: '/send-email/orders/:orderId',
      element: (
        <IsAdmin>
          <SendEmailPage />
        </IsAdmin>
      ),
    },
    {
      path: '/reviews/create/:orderId',
      element: (
        <IsOrderOwner>
          <CreateReviewPage />
        </IsOrderOwner>
      ),
    },
  ];
  return { routes };
};

export default useAppRoutes;
