// libraries
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

// utilities
import AppRouter from './router/app-router';

// styles
import './styles/tailwind.css';

export default function App() {
  return (
    <MemoryRouter>
      <AppRouter />
    </MemoryRouter>
  );
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
