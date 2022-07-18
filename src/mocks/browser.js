// jshint esversion:9

import { setupWorker, rest } from 'msw';

/* export const handlers = [
  // Handles a POST /login request
  rest.post('/login', (req, res, ctx) => {
    // Persist user's authentication in the session
    localStorage.setItem('authToken', 'authToken');
    return res(
      ctx.json({ authToken: 'authToken' })
    );
  }),

  // Handles a GET /user request
  rest.get('/verify', {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  }, (req, res, ctx) => {

    const isAuthenticated = localStorage.getItem('authToken');
    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        })
      );
    }

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({ _id: '123', email: 'casemiro@gmail.com', username: 'Casemiro', imageUrl: '', userType: 'user' })
    );
  }),
]; */

export const worker = setupWorker(
  // Handles a GET / request
  // Respond with a 200 status code
  rest.get(`${process.env.REACT_APP_PROJECT_API}/api/`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          amount: 1,
          category: 'doces',
          description: 'Curabitur aliquet quam id dui posuere blandit. Nulla porttitor accumsan tincidunt.',
          imageUrl: '',
          name: 'Bolo de morango',
          price: 9.99,
          _id: '1',
          deleted: false,
        },
        {
          amount: 1,
          category: 'salgados',
          description: 'Curabitur aliquet quam id dui posuere blandit. Nulla porttitor accumsan tincidunt.',
          imageUrl: '',
          name: 'Rissois de atum (12)',
          price: 9.99,
          _id: '3',
          deleted: false,
        },
      ])
    );
  })
);

worker.start({
  onUnhandledRequest: 'warn',
});
