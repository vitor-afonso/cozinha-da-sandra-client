// jshint esversion:9

import { rest } from 'msw';

export const handlers = [
  // Handles a POST /login request
  rest.get(`${process.env.REACT_APP_PROJECT_API}/api/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
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
  }),
];
