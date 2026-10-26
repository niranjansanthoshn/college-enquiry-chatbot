import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  GraduationCap,
  Users,
  CreditCard,
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useChat } from '../context/ChatContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setInputDraft } = useChat();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedDept !== 'All') params.department = selectedDept;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [courseRes, deptRes] = await Promise.all([
        api.get('/courses', { params }),
        api.get('/courses/departments')
      ]);

      if (courseRes.data.success) {
        setCourses(courseRes.data.data);
      }
      if (deptRes.data.success) {
        setDepartments(['All', ...deptRes.data.data]);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses from server. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedDept]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleAskChatbot = (course) => {
    const question = `What are the eligibility criteria, syllabus, and fees for ${course.name} (${course.courseCode})?`;
    setInputDraft(question);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Academic Programs 2026-2027</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Explore Accredited Courses
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Browse our AICTE & NBA accredited undergraduate and postgraduate degree programs with verified fee schedules and eligibility guidelines.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                id="course-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course name, code, or keywords (e.g. AI, Cloud, MBA)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-24 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                id="course-search-submit-btn"
                type="submit"
                className="absolute right-1.5 top-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Department Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 pl-1">
                <Filter className="h-3 w-3" /> Dept:
              </span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium shrink-0 transition-colors ${
                    selectedDept === dept
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No courses match your query</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search keywords or department filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Course Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-brand-500/50 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                      {course.courseCode}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {course.department}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {course.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Info Metrics Table/List */}
                  <div className="mt-5 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
                    
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-brand-500" /> Duration:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Users className="h-3.5 w-3.5 text-brand-500" /> Intake Seats:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {course.seats ? `${course.seats} Seats` : 'Verified on request'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <CreditCard className="h-3.5 w-3.5 text-emerald-500" /> Annual Fees:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{course.fees}</span>
                    </div>

                    <div className="pt-2 text-slate-500">
                      <strong className="text-slate-700 dark:text-slate-200">Eligibility:</strong>{' '}
                      <span>{course.eligibility}</span>
                    </div>

                  </div>
                </div>

                {/* Card CTA: Ask Chatbot */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    id={`ask-chatbot-btn-${course.courseCode}`}
                    onClick={() => handleAskChatbot(course)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-50 border border-brand-200/80 py-2.5 text-xs font-bold text-brand-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:bg-brand-950/40 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-600 dark:hover:text-white transition-all shadow-sm group cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 group-hover:text-white" />
                    <span>Ask Chatbot about this Course</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
