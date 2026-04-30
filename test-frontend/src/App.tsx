import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateOffer from './pages/CreateOffer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <nav className="bg-slate-900 text-white p-4 shadow-md border-b-4 border-blue-500">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <h1 className="text-xl font-bold tracking-wide">Kódigo POS Admin</h1>
            </div>
            <div className="space-x-4 font-medium flex items-center">
              <Link to="/" className="text-slate-300 hover:text-white transition">Catálogo</Link>
              <Link to="/crear-oferta" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-500 transition text-sm">
                + Nueva Separata
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6 mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crear-oferta" element={<CreateOffer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;