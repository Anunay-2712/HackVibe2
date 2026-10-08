import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Landing from './pages/Landing';
import Investigation from './pages/Investigation';

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/investigate/:id" element={<Investigation />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
