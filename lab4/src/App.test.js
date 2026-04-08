import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({
    user: null,
    loading: false,
    signUp: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock('./services/articlesService', () => ({
  getArticles: jest.fn().mockResolvedValue([]),
  getArticleById: jest.fn().mockResolvedValue(null),
  updateLikes: jest.fn().mockResolvedValue(1),
  deleteArticle: jest.fn().mockResolvedValue({ ok: true }),
  updateArticle: jest.fn().mockResolvedValue({ ok: true }),
  getMyArticles: jest.fn().mockResolvedValue([]),
  seedDatabase: jest.fn().mockResolvedValue({ ok: true, skipped: true }),
}));

jest.mock('./services/commentsService', () => ({
  getComments: jest.fn().mockResolvedValue([]),
  addComment: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock(
  'react-router-dom',
  () => ({
    Routes: ({ children }) => {
      const routes = Array.isArray(children) ? children : [children];
      return <div>{routes[0]}</div>;
    },
    Route: ({ element }) => element,
    Link: ({ children, to, ...rest }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

test('renders blog navigation title', async () => {
  render(<App />);

  const logoElement = await screen.findByText(/Блог про подорожі/i);
  expect(logoElement).toBeInTheDocument();
});
