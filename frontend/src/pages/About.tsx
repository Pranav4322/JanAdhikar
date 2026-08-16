import { Zap, ShieldCheck, Eye, ShieldQuestion, Map, Building2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const problems = [
  { icon: Zap, title: 'Delayed grievance handling', solution: 'NLP auto-classification routes complaints in under 2 seconds, cutting manual triaging entirely.' },
  { icon: ShieldCheck, title: 'Citizens distrust government', solution: 'Real-time tracking with status updates at every stage builds accountability and restores confidence.' },
  { icon: Eye, title: 'Opaque public spending', solution: 'Every rupee of project spending is published with drill-down to individual receipts — zero black boxes.' },
  { icon: ShieldQuestion, title: 'Corruption in contracts', solution: 'AI anomaly detection flags overspending, inflated bills, and duplicate receipts before they become systemic.' },
  { icon: Map, title: 'Poor resource allocation', solution: 'Analytics and trend data show where problems cluster — guiding data-driven budget decisions.' },
  { icon: Building2, title: 'Citizen-govt. disconnect', solution: 'A single, accessible platform makes filing, tracking, and understanding governance simple for every citizen.' },
];

const techStack = [
  { tag: 'AI/ML', title: 'NLP Classification', desc: 'Auto-categorizes and prioritizes complaints filed in text, routing each to the correct department.' },
  { tag: 'AI/ML', title: 'Anomaly Detection', desc: 'Rule-based engine flags overspending, oversized single expenses, and duplicate receipts in real time.' },
  { tag: 'Backend', title: 'Node.js + TypeScript', desc: 'Express REST API with Prisma ORM, deployed on Render, backed by PostgreSQL on Neon.' },
  { tag: 'Frontend', title: 'React + TypeScript', desc: 'Vite-powered SPA with Tailwind CSS, deployed for fast, responsive citizen and official interfaces.' },
  { tag: 'Auth', title: 'JWT + Voter ID', desc: 'Role-based access control with a Voter ID (EPIC) verification layer at registration.' },
  { tag: 'Future Scope', title: 'Blockchain Layer', desc: 'Planned integration for tamper-proof, publicly verifiable contract and receipt storage.' },
];

const stats = [
  { value: '100%', label: 'Backend Deployed', note: 'Live on Render' },
  { value: '3', label: 'AI-Powered Features', note: 'Categorization, urgency, anomaly detection' },
  { value: '6', label: 'Core Pages Built', note: 'Report, Track, Projects, Analytics & more' },
  { value: '2', label: 'User Roles', note: 'Citizen & Official access control' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Mission */}
      <section className="bg-gradient-to-b from-jan-cream to-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-jan-orange/10 text-jan-orange text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            Our Mission
          </span>
          <h1 className="text-4xl font-bold text-jan-dark mb-2">
            Bridging Citizens and<br />
            <span className="text-jan-orange">Governance with AI</span>
          </h1>
          <p className="text-gray-500 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            JanAdhar was built because the gap between a citizen's complaint and its resolution shouldn't
            be measured in weeks and frustrating phone calls — it should be measured in seconds of AI
            classification and hours of government action.
          </p>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-xs font-semibold tracking-wider text-jan-orange mb-2">WHY WE BUILT THIS</p>
        <h2 className="text-center text-3xl font-bold text-jan-dark mb-14">Problems We Solve</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 rounded-full bg-jan-cream flex items-center justify-center mb-4">
                <p.icon className="text-jan-orange" size={18} />
              </div>
              <p className="text-xs font-semibold text-gray-400 tracking-wide mb-1">PROBLEM</p>
              <h3 className="font-bold text-jan-dark mb-3">{p.title}</h3>
              <p className="text-xs font-semibold text-jan-orange tracking-wide mb-1">SOLUTION</p>
              <p className="text-sm text-gray-600 leading-relaxed">{p.solution}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact numbers */}
      <section className="bg-jan-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-wider text-gray-400 mb-2">IMPACT SO FAR</p>
          <h2 className="text-center text-3xl font-bold text-white mb-14">What We've Built</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-jan-orange mb-2">{s.value}</p>
                <p className="text-white font-semibold text-sm">{s.label}</p>
                <p className="text-gray-500 text-xs mt-1">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-xs font-semibold tracking-wider text-jan-orange mb-2">ENGINEERING</p>
        <h2 className="text-center text-3xl font-bold text-jan-dark mb-14">Technology Stack</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {techStack.map((t) => (
            <div key={t.title} className="bg-jan-cream rounded-xl p-6">
              <span className="inline-block bg-white text-jan-orange text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {t.tag}
              </span>
              <h3 className="font-bold text-jan-dark mb-2">{t.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}