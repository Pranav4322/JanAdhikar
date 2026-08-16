import { Building2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-jan-dark text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-jan-orange flex items-center justify-center">
                <Building2 className="text-white" size={16} />
              </div>
              <span className="font-bold text-white">JanAdhar</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered platform bridging citizens and governance through transparency and accountability.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-500 mb-4">CITIZENS</p>
            <ul className="space-y-3 text-sm">
              <li><a href="/report" className="hover:text-white">Report Issue</a></li>
              <li><a href="/track" className="hover:text-white">Track Complaint</a></li>
              <li><a href="#" className="hover:text-white">Ward Map</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-500 mb-4">TRANSPARENCY</p>
            <ul className="space-y-3 text-sm">
              <li><a href="/projects" className="hover:text-white">Project Dashboard</a></li>
              <li><a href="#" className="hover:text-white">Tenders</a></li>
              <li><a href="#" className="hover:text-white">Budgets</a></li>
              <li><a href="#" className="hover:text-white">Anomaly Reports</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-500 mb-4">PLATFORM</p>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">API Docs</a></li>
              <li><a href="#" className="hover:text-white">Blockchain Explorer</a></li>
              <li><a href="/analytics" className="hover:text-white">Analytics</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 JanAdhar. Built for every citizen.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>Blockchain Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}