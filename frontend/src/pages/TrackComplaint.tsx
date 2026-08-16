import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import { useAuth } from '../lib/AuthContext';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
}

const statusLabel: Record<string, string> = {
  filed: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const statusBadge: Record<string, string> = {
  filed: 'bg-gray-100 text-gray-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
};

const statusDot: Record<string, string> = {
  filed: 'bg-gray-400',
  assigned: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  resolved: 'bg-green-500',
};

const filters = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'];

export default function TrackComplaint() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchComplaints();
  }, [user]);

  async function fetchComplaints() {
    setLoading(true);
    try {
      const res = await api.get('/complaints/mine');
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = complaints.filter((c) => {
    const matchesFilter = activeFilter === 'All' || statusLabel[c.status] === activeFilter;
    const matchesSearch =
      search === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-xs font-semibold tracking-wider text-jan-orange mb-2">GRIEVANCE TRACKER</p>
        <h1 className="text-3xl font-bold text-jan-dark mb-2">Track Your Complaint</h1>
        <p className="text-gray-500 mb-8">Search by complaint ID or keyword to see real-time status.</p>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-4 py-3">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Complaint ID or keyword..."
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                activeFilter === f
                  ? 'bg-jan-orange text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-4">
            {loading && <p className="text-sm text-gray-400">Loading your complaints...</p>}
            {!loading && filtered.length === 0 && (
              <p className="text-sm text-gray-400">No complaints found. File one from the Report Issue page.</p>
            )}
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left bg-white border rounded-xl p-5 transition-colors ${
                  selected?.id === c.id ? 'border-jan-orange' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${statusDot[c.status]}`} />
                  <h3 className="font-semibold text-jan-dark text-sm leading-snug">{c.title}</h3>
                </div>
                <div className="flex items-center gap-2 mb-1 ml-4">
                  <span className="text-xs text-gray-400 font-mono">{c.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[c.status]}`}>
                    {statusLabel[c.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400 ml-4">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="bg-jan-cream rounded-xl p-8 h-fit sticky top-24">
            {!selected ? (
              <p className="text-center text-gray-400 py-16">Select a complaint to view its details.</p>
            ) : (
              <div>
                <span className={`text-xs px-3 py-1 rounded-full ${statusBadge[selected.status]}`}>
                  {statusLabel[selected.status]}
                </span>
                <h2 className="font-bold text-jan-dark text-xl mt-4 mb-2">{selected.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{selected.description}</p>

                <div className="space-y-3 bg-white rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Complaint ID</span>
                    <span className="font-mono font-semibold text-jan-dark">
                      {selected.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-semibold text-jan-dark">{selected.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Urgency</span>
                    <span className="font-semibold text-jan-orange capitalize">{selected.urgency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Filed On</span>
                    <span className="font-semibold text-jan-dark">
                      {new Date(selected.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {selected.latitude && selected.longitude && (
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        <MapPin size={14} /> Location
                      </span>
                      <span className="font-semibold text-jan-dark text-xs">
                        {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}