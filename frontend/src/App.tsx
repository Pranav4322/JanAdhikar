import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ReportIssue from './pages/ReportIssue';
import TrackComplaint from './pages/TrackComplaint';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/track" element={<TrackComplaint />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;