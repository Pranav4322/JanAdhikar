import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';

interface ComplaintStat {
  id: string;
  category: string;
  urgency: string;
  status: string;
  createdAt: string;
}

const COLORS = ['#E8720C', '#0D5C4F', '#22C55E', '#8B5CF6', '#EF4444', '#F5A855', '#6366F1'];

const statusLabels: Record<string, string> = {
  filed: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export default function Analytics() {
  const [complaints, setComplaints] = useState<ComplaintStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await api.get('/complaints/analytics/all');
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  }

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0';

  // Category distribution
  const categoryMap: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Status breakdown
  const statusMap: Record<string, number> = {};
  complaints.forEach((c) => {
    const label = statusLabels[c.status] || c.status;
    statusMap[label] = (statusMap[label] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, count]) => ({ name, count }));

  // Urgency breakdown
  const urgencyMap: Record<string, number> = {};
  complaints.forEach((c) => {
    urgencyMap[c.urgency] = (urgencyMap[c.urgency] || 0) + 1;
  });
  const urgencyData = Object.entries(urgencyMap).map(([name, count]) => ({ name, count }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-xs font-semibold tracking-wider text-jan-orange mb-2">AI ANALYTICS</p>
        <h1 className="text-3xl font-bold text-jan-dark mb-2">Grievance Intelligence</h1>
        <p className="text-gray-500 mb-10">Real-time insights computed from live complaint data.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-jan-cream rounded-xl p-5">
            <p className="text-2xl font-bold text-jan-dark">{total}</p>
            <p className="text-xs text-gray-500 mt-1">Total Complaints</p>
          </div>
          <div className="bg-jan-cream rounded-xl p-5">
            <p className="text-2xl font-bold text-green-600">{resolved}</p>
            <p className="text-xs text-gray-500 mt-1">Resolved</p>
          </div>
          <div className="bg-jan-cream rounded-xl p-5">
            <p className="text-2xl font-bold text-jan-dark">{resolutionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Resolution Rate</p>
          </div>
          <div className="bg-jan-cream rounded-xl p-5">
            <p className="text-2xl font-bold text-red-600">
              {urgencyMap['high'] || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">High Urgency</p>
          </div>
        </div>

        {loading && <p className="text-sm text-gray-400">Loading analytics...</p>}

        {!loading && total === 0 && (
          <p className="text-sm text-gray-400">No complaint data yet. File a complaint to see analytics.</p>
        )}

        {!loading && total > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-jan-dark mb-1">Complaint Categories</h3>
              <p className="text-xs text-gray-400 mb-4">Distribution across all filed complaints</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-jan-dark mb-1">Status Breakdown</h3>
              <p className="text-xs text-gray-400 mb-4">Current stage of all complaints</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E8720C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 md:col-span-2">
              <h3 className="font-bold text-jan-dark mb-1">Urgency Levels</h3>
              <p className="text-xs text-gray-400 mb-4">AI-assessed urgency across all complaints</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={urgencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0D5C4F" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}