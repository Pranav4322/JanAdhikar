import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import { useAuth } from '../lib/AuthContext';

const categories = [
  { label: 'Roads & Footpaths', sub: 'Public Works' },
  { label: 'Water & Sewage', sub: 'Municipal Water' },
  { label: 'Electricity', sub: 'BESCOM' },
  { label: 'Sanitation & Waste', sub: 'Sanitation Board' },
  { label: 'Parks & Gardens', sub: 'Parks & Gardens' },
  { label: 'Health & Hospitals', sub: 'Health Department' },
  { label: 'Schools & Education', sub: 'Education Dept.' },
  { label: 'Other', sub: 'General Administration' },
];

const steps = ['Select Category', 'Describe Issue', 'AI Review', 'Submitted'];

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    setStep(3);
    try {
      const res = await api.post('/complaints', {
        title,
        description,
        latitude,
        longitude,
      });
      setResult(res.data);
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setStep(2);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-14">
        <p className="text-xs font-semibold tracking-wider text-jan-orange mb-2">CITIZEN PORTAL</p>
        <h1 className="text-3xl font-bold text-jan-dark mb-2">Report a Civic Issue</h1>
        <p className="text-gray-500 mb-10">AI will classify your report automatically and route it to the right department.</p>

        {/* Step indicator */}
        <div className="flex items-center mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                    step > i + 1
                      ? 'bg-jan-orange border-jan-orange text-white'
                      : step === i + 1
                      ? 'border-jan-orange text-jan-orange'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {step > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <span className={`text-xs mt-2 ${step === i + 1 ? 'text-jan-orange font-medium' : 'text-gray-400'}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${step > i + 1 ? 'bg-jan-orange' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Category */}
        {step === 1 && (
          <div>
            <h2 className="font-bold text-jan-dark text-lg mb-1">What type of issue are you reporting?</h2>
            <p className="text-sm text-gray-500 mb-6">Select the category that best describes your civic problem.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {categories.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setSelectedCategory(c.label)}
                  className={`text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedCategory === c.label
                      ? 'border-jan-orange bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm text-jan-dark">{c.label}</p>
                  <p className="text-xs text-gray-400">{c.sub}</p>
                </button>
              ))}
            </div>
            <button
              disabled={!selectedCategory}
              onClick={() => setStep(2)}
              className="w-full bg-jan-orange hover:bg-jan-orange-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Describe */}
        {step === 2 && (
          <div>
            <h2 className="font-bold text-jan-dark text-lg mb-1">Describe the issue</h2>
            <p className="text-sm text-gray-500 mb-6">Give as much detail as possible — AI will use this to categorize and prioritize your report.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-jan-dark">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-jan-orange"
                  placeholder="e.g. Large pothole near main bus stand"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-jan-dark">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-jan-orange resize-none"
                  placeholder="Describe what's wrong, how long it's been an issue, and any safety concerns..."
                />
              </div>
              <button
                onClick={useMyLocation}
                className="text-sm text-jan-orange font-medium flex items-center gap-1"
              >
                📍 {latitude ? 'Location added' : 'Add my current location'}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-lg border border-gray-200 text-jan-dark font-semibold"
              >
                ← Back
              </button>
              <button
                disabled={!title || !description}
                onClick={handleSubmit}
                className="flex-1 bg-jan-orange hover:bg-jan-orange-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Submit for AI Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: AI Review (loading) */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="animate-spin text-jan-orange mb-4" size={40} />
            <h2 className="font-bold text-jan-dark text-lg mb-1">AI is reviewing your report...</h2>
            <p className="text-sm text-gray-500">Categorizing, assessing urgency, and routing to the right department.</p>
          </div>
        )}

        {/* Step 4: Submitted */}
        {step === 4 && result && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h2 className="font-bold text-jan-dark text-2xl mb-2">Complaint Filed Successfully</h2>
            <p className="text-gray-500 mb-8">Your report has been submitted and AI-classified. Track its progress anytime.</p>

            <div className="bg-jan-cream rounded-xl p-6 max-w-md mx-auto text-left mb-8">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-500">Complaint ID</span>
                <span className="text-sm font-mono font-semibold text-jan-dark">
                  {result.complaint.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-500">AI Category</span>
                <span className="text-sm font-semibold text-jan-dark">{result.complaint.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Urgency</span>
                <span className="text-sm font-semibold text-jan-orange capitalize">{result.complaint.urgency}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/track')}
                className="bg-jan-orange hover:bg-jan-orange-light text-white font-semibold px-6 py-3 rounded-lg"
              >
                Track This Complaint
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setTitle('');
                  setDescription('');
                  setSelectedCategory('');
                  setResult(null);
                }}
                className="border border-gray-200 text-jan-dark font-semibold px-6 py-3 rounded-lg"
              >
                File Another
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}