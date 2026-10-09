import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MainPage } from './pages/MainPage';
import { BackgroundWave } from './components/layout/BackgroundWave';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Outer ambient background */}
        <div className="bg-desktop" aria-hidden="true" />
        {/* Canvas wave effect */}
        <BackgroundWave />

        <div className="app-window">
          <Navbar />
          <main className="app-content">
            <Routes>
              <Route path="/*" element={<MainPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
