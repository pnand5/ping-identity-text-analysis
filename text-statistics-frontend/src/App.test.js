import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the file upload element', () => {
  render(<App />);
  const linkElement = screen.getByTestId('uploader');
  expect(linkElement).toBeInTheDocument();
});
