import { Link } from 'react-router-dom';
import { Search, Mic, Camera, Navigation as GPS } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const recentComplaints = [
  { id: 'CMP-2025-08714', title: 'Massive pothole on MG Road near Bus Stand', status: 'In Progress', time: '2 hours ago' },
  { id: 'CMP-2025-08701', title: 'Overflowing garbage bin — residential colony', status: 'Assigned', time: '5 hours ago' },
  { id: 'CMP-2025-08688', title: 'Street light out — 3rd Cross, Gandhi Nagar', status: 'Resolved', time: '1 day ago' },
];

const statusColor: Record<string, string> = {
  'In Progress': 'text-red-500',
  Assigned: 'text-yellow-500',
  Resolved: 'text-green-500',
};

const statusBadge: Record<string, string> = {
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Assigned: 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-jan-cream">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-jan-dark leading-tight mb-6">
              Your Voice.<br />
              <span className="text-jan-orange">Your City.</span><br />
              Transparent Governance.
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              Report civic problems using text, voice, or photos. Track every complaint in real time.
              Monitor how public money is spent — all in one platform powered by AI.
            </p>
            <div className="flex gap-4 mb-10">
              <Link
                to="/report"
                className="bg-jan-orange hover:bg-jan-orange-light text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Report an Issue
              </Link>
              <Link
                to="/track"
                className="bg-white border border-gray-200 hover:bg-gray-50 text-jan-dark font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Track Complaint
              </Link>
            </div>
            <div className="flex gap-10 border-t border-gray-200 pt-6">
              <div>
                <p className="text-2xl font-bold text-jan-dark">1.2L+</p>
                <p className="text-xs text-gray-500">Complaints Resolved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-jan-dark">847</p>
                <p className="text-xs text-gray-500">Active Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-jan-dark">38</p>
                <p className="text-xs text-gray-500">Cities Covered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-jan-dark mb-1">Track Your Complaint</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your complaint ID for instant status updates</p>
            <div className="flex gap-2 mb-6">
              <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 py-2">
                <input
                  placeholder="CMP-2025-XXXXX"
                  className="w-full text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              <button className="bg-jan-orange hover:bg-jan-orange-light text-white p-2.5 rounded-lg">
                <Search size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {recentComplaints.map((c) => (
                <div key={c.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0">
                  <span className={`mt-1.5 w-2 h-2 rounded-full ${statusColor[c.status].replace('text', 'bg')}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-jan-dark leading-snug">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{c.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[c.status]}`}>{c.status}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{c.time}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  <Mic size={12} /> Voice
                </span>
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  <Camera size={12} /> Photo
                </span>
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  <GPS size={12} /> GPS
                </span>
              </div>
              <span className="text-xs text-jan-orange font-medium">AI auto-classifies</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-xs font-semibold tracking-wider text-jan-orange mb-2">SIMPLE PROCESS</p>
        <h2 className="text-center text-3xl font-bold text-jan-dark mb-14">How JanAdhar Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Submit Report', desc: 'File via text, voice, photo, or GPS location in your preferred language.', color: 'bg-jan-orange' },
            { step: '02', title: 'AI Classifies', desc: 'NLP and Computer Vision auto-categorize, prioritize, and verify the issue.', color: 'bg-jan-teal' },
            { step: '03', title: 'Dept. Assigned', desc: 'Routed to the right department with urgency score and SLA timer started.', color: 'bg-purple-600' },
            { step: '04', title: 'Tracked & Resolved', desc: 'Real-time status updates notify you at every stage until resolution.', color: 'bg-green-600' },
          ].map((s) => (
            <div key={s.step}>
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-white font-bold mb-4`}>
                {s.step === '01' ? '📄' : s.step === '02' ? '⚡' : s.step === '03' ? '🏛' : '✓'}
              </div>
              <p className="text-xs text-gray-400 mb-1">{s.step}</p>
              <h3 className="font-bold text-jan-dark mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent complaints band */}
      <section className="bg-jan-cream py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-wider text-jan-orange mb-1">LIVE UPDATES</p>
              <h2 className="text-2xl font-bold text-jan-dark">Recent Complaints</h2>
            </div>
            <Link to="/track" className="text-jan-orange font-medium text-sm">View all →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentComplaints.map((c) => (
              <div key={c.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${statusBadge[c.status]}`}>{c.status}</span>
                  <span className="text-xs text-gray-400">👍 47</span>
                </div>
                <h3 className="font-bold text-jan-dark mb-2 leading-snug">{c.title}</h3>
                <p className="text-xs text-gray-400">{c.id} · {c.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}