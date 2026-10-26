import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  MessageSquare,
  BookOpen,
  FileText,
  HelpCircle,
  Database,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Save,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  X,
  Loader2,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, college-info, faqs, enquiries, knowledge
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Data states
  const [courses, setCourses] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState({});

  // Modals & Action states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    courseCode: '',
    department: 'Computer Science',
    duration: '4 Years (8 Semesters)',
    eligibility: '',
    fees: '',
    seats: 60,
    description: '',
    active: true
  });

  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'Admissions',
    active: true
  });

  const [showKbModal, setShowKbModal] = useState(false);
  const [editingKb, setEditingKb] = useState(null);
  const [kbForm, setKbForm] = useState({
    title: '',
    category: 'Admissions',
    content: '',
    tags: '',
    active: true
  });

  const [savingInfo, setSavingInfo] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [anRes, cRes, fRes, eRes, kRes, iRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/courses'),
        api.get('/faqs'),
        api.get('/enquiries'),
        api.get('/admin/knowledge'),
        api.get('/college-info')
      ]);

      if (anRes.data.success) setAnalytics(anRes.data.data);
      if (cRes.data.success) setCourses(cRes.data.data);
      if (fRes.data.success) setFaqs(fRes.data.data);
      if (eRes.data.success) setEnquiries(eRes.data.data);
      if (kRes.data.success) setKnowledgeItems(kRes.data.data);
      if (iRes.data.success) setCollegeInfo(iRes.data.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // --- Course Handlers ---
  const handleOpenCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        name: course.name,
        courseCode: course.courseCode,
        department: course.department,
        duration: course.duration,
        eligibility: course.eligibility,
        fees: course.fees,
        seats: course.seats || 60,
        description: course.description || '',
        active: course.active
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        name: '',
        courseCode: '',
        department: 'Computer Science',
        duration: '4 Years (8 Semesters)',
        eligibility: '',
        fees: '',
        seats: 60,
        description: '',
        active: true
      });
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const res = await api.put(`/courses/${editingCourse._id}`, courseForm);
        if (res.data.success) {
          setCourses(courses.map(c => c._id === editingCourse._id ? res.data.data : c));
          showNotification('Course updated successfully.');
        }
      } else {
        const res = await api.post('/courses', courseForm);
        if (res.data.success) {
          setCourses([res.data.data, ...courses]);
          showNotification('New course created.');
        }
      }
      setShowCourseModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving course.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
      showNotification('Course removed.');
    } catch (err) {
      alert('Failed to delete course.');
    }
  };

  // --- College Info Handlers ---
  const handleSaveCollegeInfo = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await api.put('/college-info', collegeInfo);
      if (res.data.success) {
        setCollegeInfo(res.data.data);
        showNotification('College institutional information updated successfully!');
      }
    } catch (err) {
      alert('Error updating college information.');
    } finally {
      setSavingInfo(false);
    }
  };

  // --- FAQ Handlers ---
  const handleOpenFaqModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        active: faq.active
      });
    } else {
      setEditingFaq(null);
      setFaqForm({
        question: '',
        answer: '',
        category: 'Admissions',
        active: true
      });
    }
    setShowFaqModal(true);
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        const res = await api.put(`/faqs/${editingFaq._id}`, faqForm);
        if (res.data.success) {
          setFaqs(faqs.map(f => f._id === editingFaq._id ? res.data.data : f));
          showNotification('FAQ updated.');
        }
      } else {
        const res = await api.post('/faqs', faqForm);
        if (res.data.success) {
          setFaqs([res.data.data, ...faqs]);
          showNotification('New FAQ added.');
        }
      }
      setShowFaqModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving FAQ.');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      setFaqs(faqs.filter(f => f._id !== id));
      showNotification('FAQ deleted.');
    } catch (err) {
      alert('Failed to delete FAQ.');
    }
  };

  // --- Enquiry Status Handlers ---
  const handleUpdateEnquiryStatus = async (id, newStatus, note = null) => {
    try {
      const body = { status: newStatus };
      if (note !== null) body.internalNotes = note;
      const res = await api.patch(`/enquiries/${id}`, body);
      if (res.data.success) {
        setEnquiries(enquiries.map(e => e._id === id ? res.data.data : e));
        showNotification('Enquiry status updated.');
      }
    } catch (err) {
      alert('Error updating enquiry.');
    }
  };

  // --- Knowledge Base Handlers ---
  const handleOpenKbModal = (item = null) => {
    if (item) {
      setEditingKb(item);
      setKbForm({
        title: item.title,
        category: item.category,
        content: item.content,
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        active: item.active
      });
    } else {
      setEditingKb(null);
      setKbForm({
        title: '',
        category: 'Admissions',
        content: '',
        tags: '',
        active: true
      });
    }
    setShowKbModal(true);
  };

  const handleSaveKb = async (e) => {
    e.preventDefault();
    try {
      if (editingKb) {
        const res = await api.put(`/admin/knowledge/${editingKb._id}`, kbForm);
        if (res.data.success) {
          setKnowledgeItems(knowledgeItems.map(k => k._id === editingKb._id ? res.data.data : k));
          showNotification('Knowledge item updated.');
        }
      } else {
        const res = await api.post('/admin/knowledge', kbForm);
        if (res.data.success) {
          setKnowledgeItems([res.data.data, ...knowledgeItems]);
          showNotification('Knowledge item added.');
        }
      }
      setShowKbModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving knowledge item.');
    }
  };

  const handleDeleteKb = async (id) => {
    if (!window.confirm('Delete this knowledge item?')) return;
    try {
      await api.delete(`/admin/knowledge/${id}`);
      setKnowledgeItems(knowledgeItems.filter(k => k._id !== id));
      showNotification('Knowledge item deleted.');
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Analytics Overview', icon: BarChart3 },
    { id: 'courses', label: 'Manage Courses', icon: BookOpen, count: courses.length },
    { id: 'college-info', label: 'College Information', icon: BuildingIcon },
    { id: 'faqs', label: 'Manage FAQs', icon: HelpCircle, count: faqs.length },
    { id: 'enquiries', label: 'Contact Enquiries', icon: FileText, count: enquiries.filter(e => e.status === 'pending').length },
    { id: 'knowledge', label: 'Chatbot Knowledge (RAG)', icon: Database, count: knowledgeItems.length },
  ];

  function BuildingIcon(props) {
    return <Shield {...props} />;
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shrink-0 hidden md:block">
        <div className="p-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="font-heading text-sm font-bold text-slate-900 dark:text-white">Admin Control</div>
              <div className="text-[10px] text-slate-400">Institutional Governance</div>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-brand-200 text-brand-800 dark:bg-brand-900 dark:text-brand-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Mobile Tab Selector */}
        <div className="md:hidden mb-6 flex overflow-x-auto pb-2 gap-2">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Toast Notification */}
        {actionSuccess && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & ANALYTICS */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                    Admissions & Chatbot Metrics
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">Real-time statistics across students, inquiries, and automated conversational sessions.</p>
                </div>

                {/* 5 Summary Cards required by prompt */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">Total Students</span>
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      {analytics?.summary?.totalStudents || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Registered student accounts</div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">Conversations</span>
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      {analytics?.summary?.totalConversations || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">AI sessions handled 24/7</div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">Active Courses</span>
                      <BookOpen className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      {analytics?.summary?.totalCourses || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Degree programs offered</div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">Contact Enquiries</span>
                      <FileText className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      {analytics?.summary?.totalEnquiries || 0}
                    </div>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                      {analytics?.summary?.pendingEnquiries || 0} pending review
                    </div>
                  </div>
                </div>

                {/* Most Frequently Asked Questions & Category Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top FAQs */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-brand-600" />
                      Most Frequently Inquired Questions
                    </h3>
                    <div className="space-y-3">
                      {analytics?.topFaqs?.map((faq, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200 pr-2 truncate">
                            {idx + 1}. {faq.question}
                          </span>
                          <span className="rounded bg-brand-100 text-brand-700 px-2 py-0.5 text-[10px] font-bold dark:bg-brand-950 dark:text-brand-300 shrink-0">
                            {faq.clickCount} inquiries
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enquiry Category Stats */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-indigo-600" />
                      Query Category Breakdown
                    </h3>
                    <div className="space-y-3">
                      {analytics?.categoryStats?.map((cat, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            <span>{cat._id || 'General'}</span>
                            <span>{cat.count} inquiries</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full"
                              style={{ width: `${Math.min(100, (cat.count / (analytics.summary.totalConversations || 1)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MANAGE COURSES */}
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      Course Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Add, modify, or archive degree programs, fees, and seat allocations.</p>
                  </div>
                  <button
                    onClick={() => handleOpenCourseModal()}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add New Course
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-5 py-3.5">Code</th>
                        <th className="px-5 py-3.5">Course Name</th>
                        <th className="px-5 py-3.5">Department</th>
                        <th className="px-5 py-3.5">Annual Fees</th>
                        <th className="px-5 py-3.5">Seats</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {courses.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850">
                          <td className="px-5 py-3.5 font-bold text-brand-600 dark:text-brand-400">{c.courseCode}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{c.name}</td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{c.department}</td>
                          <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">{c.fees}</td>
                          <td className="px-5 py-3.5">{c.seats || 60}</td>
                          <td className="px-5 py-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleOpenCourseModal(c)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-800"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(c._id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: MANAGE COLLEGE INFORMATION */}
            {activeTab === 'college-info' && (
              <div className="space-y-6 animate-fade-in max-w-4xl">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                    College Institutional Knowledge
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">This official information serves as the grounded truth for the 24/7 AI chatbot.</p>
                </div>

                <form onSubmit={handleSaveCollegeInfo} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        College Name
                      </label>
                      <input
                        type="text"
                        value={collegeInfo.collegeName || ''}
                        onChange={(e) => setCollegeInfo({ ...collegeInfo, collegeName: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={collegeInfo.contactPhone || ''}
                        onChange={(e) => setCollegeInfo({ ...collegeInfo, contactPhone: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Official Admissions Email
                      </label>
                      <input
                        type="email"
                        value={collegeInfo.contactEmail || ''}
                        onChange={(e) => setCollegeInfo({ ...collegeInfo, contactEmail: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Office Working Hours
                      </label>
                      <input
                        type="text"
                        value={collegeInfo.officeHours || ''}
                        onChange={(e) => setCollegeInfo({ ...collegeInfo, officeHours: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Campus Physical Address
                    </label>
                    <input
                      type="text"
                      value={collegeInfo.address || ''}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, address: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Admission Procedures & Cutoffs
                    </label>
                    <textarea
                      rows="3"
                      value={collegeInfo.admissionInformation || ''}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, admissionInformation: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fee Structures & Installment Rules
                    </label>
                    <textarea
                      rows="3"
                      value={collegeInfo.feeInformation || ''}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, feeInformation: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Scholarships & Financial Assistance
                    </label>
                    <textarea
                      rows="3"
                      value={collegeInfo.scholarshipInformation || ''}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, scholarshipInformation: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hostel & Dining Accommodation
                    </label>
                    <textarea
                      rows="3"
                      value={collegeInfo.hostelInformation || ''}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, hostelInformation: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Placement & Corporate Hiring Records
                    </label>
                    <textarea
                      rows="3"
                      value={collegeInfo.placementInformation || ''}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, placementInformation: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={savingInfo}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{savingInfo ? 'Saving Changes...' : 'Save College Information'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: MANAGE FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      FAQ Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Frequently asked questions used for instant chatbot retrieval.</p>
                  </div>
                  <button
                    onClick={() => handleOpenFaqModal()}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add New FAQ
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div
                      key={f._id}
                      className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            {f.category}
                          </span>
                          <span className="text-[10px] text-slate-400">Inquiries: {f.clickCount || 0}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{f.question}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{f.answer}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenFaqModal(f)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(f._id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: MANAGE ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                    Contact Form Enquiries
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">Review student applications, update resolution status, and record internal officer notes.</p>
                </div>

                <div className="space-y-4">
                  {enquiries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                      No contact enquiries submitted yet.
                    </div>
                  ) : (
                    enquiries.map((enq) => (
                      <div
                        key={enq._id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{enq.subject}</span>
                            <div className="text-xs text-slate-500">
                              From: <strong>{enq.name}</strong> ({enq.email}) {enq.phone && `• ${enq.phone}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">Under Review</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                          "{enq.message}"
                        </p>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add or update internal admissions note..."
                            defaultValue={enq.internalNotes || ''}
                            onBlur={(e) => handleUpdateEnquiryStatus(enq._id, enq.status, e.target.value)}
                            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                          <span className="text-[10px] text-slate-400">Saves on blur</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: MANAGE CHATBOT KNOWLEDGE BASE (RAG) */}
            {activeTab === 'knowledge' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      RAG Knowledge Base
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Specialized facts, cutoff records, and policies indexed by the AI retrieval engine.</p>
                  </div>
                  <button
                    onClick={() => handleOpenKbModal()}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Knowledge Fact
                  </button>
                </div>

                <div className="space-y-3">
                  {knowledgeItems.map((kb) => (
                    <div
                      key={kb._id}
                      className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            {kb.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Tags: {Array.isArray(kb.tags) ? kb.tags.join(', ') : 'None'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{kb.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{kb.content}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenKbModal(kb)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteKb(kb._id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* --- COURSE MODAL --- */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                {editingCourse ? 'Edit Academic Course' : 'Create New Course'}
              </h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  placeholder="e.g. B.Tech in Artificial Intelligence & Machine Learning"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.courseCode}
                    onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })}
                    placeholder="AIML-102"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                    placeholder="Computer Science"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Annual Fees *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.fees}
                    onChange={(e) => setCourseForm({ ...courseForm, fees: e.target.value })}
                    placeholder="₹1,20,000 per year"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Intake Seats</label>
                  <input
                    type="number"
                    value={courseForm.seats}
                    onChange={(e) => setCourseForm({ ...courseForm, seats: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Eligibility Criteria *</label>
                <input
                  type="text"
                  required
                  value={courseForm.eligibility}
                  onChange={(e) => setCourseForm({ ...courseForm, eligibility: e.target.value })}
                  placeholder="10+2 with 65% aggregate in PCM"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FAQ MODAL --- */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Courses">Courses</option>
                  <option value="Fees">Fees</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Placements">Placements</option>
                  <option value="Examinations">Examinations</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Answer *</label>
                <textarea
                  rows="4"
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- KNOWLEDGE BASE MODAL --- */}
      {showKbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                {editingKb ? 'Edit Knowledge Fact' : 'Add New Knowledge Fact'}
              </h3>
              <button onClick={() => setShowKbModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveKb} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={kbForm.category}
                  onChange={(e) => setKbForm({ ...kbForm, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Courses">Courses</option>
                  <option value="Fees">Fees</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Placements">Placements</option>
                  <option value="Examinations">Examinations</option>
                  <option value="Campus">Campus</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={kbForm.title}
                  onChange={(e) => setKbForm({ ...kbForm, title: e.target.value })}
                  placeholder="e.g. 2026 Management Quota Reservation Details"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Detailed Content (Ground Truth) *</label>
                <textarea
                  rows="4"
                  required
                  value={kbForm.content}
                  onChange={(e) => setKbForm({ ...kbForm, content: e.target.value })}
                  placeholder="Official facts the AI will use to answer user queries..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-1">Search Keywords / Tags (comma separated)</label>
                <input
                  type="text"
                  value={kbForm.tags}
                  onChange={(e) => setKbForm({ ...kbForm, tags: e.target.value })}
                  placeholder="cutoffs, quota, seats, cet"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKbModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
                >
                  Save Fact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
