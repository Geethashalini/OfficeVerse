import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Spotlight from './pages/Spotlight';
import Celebrations from './pages/Celebrations';
import Announcements from './pages/Announcements';
import Policies from './pages/Policies';
import Kudos from './pages/Kudos';
import Directory from './pages/Directory';
import Leaves from './pages/Leaves';
import Feedback from './pages/Feedback';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/spotlight" element={<Spotlight />} />
        <Route path="/celebrations" element={<Celebrations />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/kudos" element={<Kudos />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  );
}
