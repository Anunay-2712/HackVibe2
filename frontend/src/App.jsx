import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Investigation from './pages/Investigation';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/investigate/:id" element={<Investigation />} />
      </Routes>
    </Layout>
  );
}

export default App;
