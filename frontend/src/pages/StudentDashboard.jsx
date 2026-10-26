import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MessageSquare,
  History,
  FileText,
  Clock,
  Trash2,
  Calendar,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import api from '../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { loadConversation } = useChat();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [chatRes, enqRes, faqRes] = await Promise.all([
        api.get('/chat/history'),
        api.get('/enquiries'),
        api.get('/faqs')
      ]);

      if (chatRes.data.success) {
        setConversations(chatRes.data.data);
      }
      if (enqRes.data.success) {
        setEnquiries(enqRes.data.data);
      }
      if (faqRes.data.success) {
        setFaqs(faqRes.data.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;
    setDeletingId(id);
    try {
      const res = await api.delete(`/chat/history/${id}`);
      if (res.data.success) {
        setConversations(conversations.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenConversation = (id) => {
    loadConversation(id);
    navigate('/chat');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle className="h-3 w-3" /> Resolved
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <Clock className="h-3 w-3" /> Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 p-8 text-white shadow-lg mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm mb-3">
                <User className="h-3.5 w-3.5" />
                <span>Student Portal</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-2 text-sm text-blue-100 max-w-xl">
                Track your admission inquiries, review previous AI chatbot consultations, and monitor official contact submissions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-md hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
              >
                <MessageSquare className="h-4 w-4" />
                Launch AI Chatbot
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (8 cols): Past Conversations & Submitted Enquiries */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Previous Conversations Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Your Chatbot Conversations
                  </h2>
                </div>
                <Link
                  to="/chat"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
                >
                  New Chat <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-600" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 dark:border-slate-800">
                  You haven't initiated any chatbot sessions yet. Click "Launch AI Chatbot" to ask about courses, fees, or hostel amenities!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {conversations.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleOpenConversation(item._id)}
                      className="group flex items-center justify-between py-3.5 hover:bg-slate-50 dark:hover:bg-slate-850 px-3 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                          {item.title}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {item.category || 'General'}
                          </span>
                          <span>{item.messageCount} messages</span>
                          <span>•</span>
                          <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteConversation(item._id, e)}
                        disabled={deletingId === item._id}
                        title="Delete Session"
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submitted Contact Enquiries Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Official Contact Form Submissions
                  </h2>
                </div>
                <Link
                  to="/contact"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
                >
                  Submit New <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-600" />
                </div>
              ) : enquiries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 dark:border-slate-800">
                  No contact enquiries submitted from your registered email address.
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div
                      key={enq._id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {enq.subject}
                        </div>
                        <div>{getStatusBadge(enq.status)}</div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {enq.message}
                      </p>
                      {enq.internalNotes && (
                        <div className="mt-2.5 rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
                          <strong>Admissions Officer Note:</strong> {enq.internalNotes}
                        </div>
                      )}
                      <div className="mt-2 text-[10px] text-slate-400">
                        Submitted on: {new Date(enq.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Profile Card & Quick FAQs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Student Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Student Profile
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold text-lg">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="font-heading font-bold text-slate-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                <div className="flex justify-between text-slate-500">
                  <span>Role:</span>
                  <span className="font-semibold text-brand-600 capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Registered:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Saved Sessions:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{conversations.length}</span>
                </div>
              </div>
            </div>

            {/* Quick FAQ Reference */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-slate-900 dark:text-white mb-4">
                <HelpCircle className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Quick FAQ Highlights</span>
              </div>
              <div className="space-y-3">
                {faqs.map((f, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-2.5 last:border-none">
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                      {f.question}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                      {f.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
