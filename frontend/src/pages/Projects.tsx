import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';

interface Expense {
  id: string;
  amount: number;
  description: string;
  flagged: boolean;
  flagReason: string | null;
  dateSubmitted: string;
}

interface Project {
  id: string;
  title: string;
  department: string;
  budgetAllocated: number;
  contractorName: string;
  status: string;
  progressPercent: number;
  expenses: Expense[];
}

const statusBadge: Record<string, string> = {
  ongoing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  flagged: 'bg-red-100 text-red-700',
};

function formatCr(amount: number) {
  return `₹${(amount / 10000000).toFixed(1)}Cr`;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      // /projects returns list without expenses — fetch each with detail for full data
      const listRes = await api.get('/projects');
      const detailed = await Promise.all(
        listRes.data.projects.map((p: any) => api.get(`/projects/${p.id}`).then((r) => r.data.project))
      );
      setProjects(detailed);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  }

  const totalBudget = projects.reduce((sum, p) => sum + p.budgetAllocated, 0);
  const totalSpent = projects.reduce(
    (sum, p) => sum + p.expenses.reduce((s, e) => s + e.amount, 0),
    0
  );
  const activeCount = projects.filter((p) => p.status === 'ongoing').length;
  const flaggedExpenseCount = projects.reduce(
    (sum, p) => sum + p.expenses.filter((e) => e.flagged).length,
    0
  );

  const chartData = projects.map((p) => ({
    name: p.title.length > 14 ? p.title.slice(0, 14) + '…' : p.title,
    Budget: Math.round(p.budgetAllocated / 100000) / 10, // in lakh->approx, keep simple
    Spent: Math.round(p.expenses.reduce((s, e) => s + e.amount, 0) / 100000) / 10,
  }));

  const firstAnomaly = projects
    .flatMap((p) => p.expenses.filter((e) => e.flagged).map((e) => ({ ...e, projectTitle: p.title })))
    [0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-jan-cream">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-xs font-semibold tracking-wider text-jan-orange mb-2">GOVERNMENT TRANSPARENCY</p>
          <h1 className="text-3xl font-bold text-jan-dark mb-2">Project & Spending Dashboard</h1>
          <p className="text-gray-500 mb-8">
            Every government project — budget, contractor, tender, expense — published openly. AI monitors for anomalies.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5">
              <p className="text-2xl font-bold text-jan-dark">{formatCr(totalBudget)}</p>
              <p className="text-xs text-gray-500 mt-1">Total Budget</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-2xl font-bold text-jan-dark">{formatCr(totalSpent)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% utilized
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-2xl font-bold text-jan-dark">{activeCount}</p>
              <p className="text-xs text-gray-500 mt-1">Active Projects</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-2xl font-bold text-red-600">{flaggedExpenseCount}</p>
              <p className="text-xs text-gray-500 mt-1">Anomalies Flagged</p>
            </div>
          </div>

          {firstAnomaly && (
            <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-5 py-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-700">
                  <span className="font-semibold">AI Anomaly Alert:</span> "{firstAnomaly.projectTitle}" —{' '}
                  {firstAnomaly.flagReason} (₹{firstAnomaly.amount.toLocaleString('en-IN')})
                </p>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-jan-dark mb-1">Budget vs. Actual Spending</h3>
              <p className="text-xs text-gray-400 mb-4">All projects — amounts in ₹ Lakh</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Budget" fill="#F5A855" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Spent" fill="#E8720C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Project list */}
      <div className="max-w-7xl mx-auto px-6 py-14 space-y-6">
        {loading && <p className="text-sm text-gray-400">Loading projects...</p>}
        {!loading && projects.length === 0 && (
          <p className="text-sm text-gray-400">No government projects published yet.</p>
        )}
        {projects.map((p) => {
          const spent = p.expenses.reduce((s, e) => s + e.amount, 0);
          const utilization = p.budgetAllocated > 0 ? (spent / p.budgetAllocated) * 100 : 0;
          const hasFlagged = p.expenses.some((e) => e.flagged);
          const isExpanded = expandedId === p.id;

          return (
            <div key={p.id} className="border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {hasFlagged && <AlertTriangle className="text-red-500" size={18} />}
                  <h3 className="font-bold text-jan-dark text-lg">{p.title}</h3>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    hasFlagged ? statusBadge.flagged : statusBadge[p.status] || statusBadge.ongoing
                  }`}
                >
                  {hasFlagged ? 'Flagged' : p.status === 'ongoing' ? 'In Progress' : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{p.department}</p>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Budget utilization</span>
                  <span className="font-semibold">
                    {formatCr(spent)} / {formatCr(p.budgetAllocated)} ({utilization.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      utilization > 100 ? 'bg-red-500' : utilization > 80 ? 'bg-jan-orange' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {p.contractorName} · Progress: {p.progressPercent}% · {p.expenses.length} receipts
                  {hasFlagged && (
                    <span className="text-red-600 font-semibold ml-1">
                      · {p.expenses.filter((e) => e.flagged).length} anomalies
                    </span>
                  )}
                </p>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="text-jan-orange text-sm font-medium flex items-center gap-1"
                >
                  View receipts {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                  {p.expenses.length === 0 && (
                    <p className="text-xs text-gray-400">No expenses logged yet.</p>
                  )}
                  {p.expenses.map((e) => (
                    <div
                      key={e.id}
                      className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg ${
                        e.flagged ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="text-jan-dark">{e.description}</p>
                        {e.flagged && <p className="text-xs text-red-600">{e.flagReason}</p>}
                      </div>
                      <span className="font-semibold text-jan-dark">₹{e.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}