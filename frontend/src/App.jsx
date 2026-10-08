import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Investigation from './pages/Investigation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/investigate/:id" element={<Investigation />} />
    </Routes>
  );
}

export default App;
