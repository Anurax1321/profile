import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Hero from './components/sections/Hero';
import './index.css';

// Lazy-load /work so the landing page bundle stays unchanged.
const Work = lazy(() => import('./pages/Work'));

function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/work"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
                <Work />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
