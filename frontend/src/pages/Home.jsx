import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Building,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Users,
  Compass,
  FileCheck
} from 'lucide-react';
import api from '../services/api';
import { useChat } from '../context/ChatContext';

export default function Home() {
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const { setInputDraft } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqRes, infoRes] = await Promise.all([
          api.get('/faqs'),
          api.get('/college-info')
        ]);
        if (faqRes.data.success) {
          setFaqs(faqRes.data.data.slice(0, 6));
        }
        if (infoRes.data.success) {
          setCollegeInfo(infoRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoadingFaqs(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryPrompt) => {
    setInputDraft(categoryPrompt);
    navigate('/chat');
  };

  const categories = [
    {
      title: 'Admissions & Cutoffs',
      desc: 'Eligibility criteria, entrance exams (CET/JEE), documents & important dates.',
      icon: FileCheck,
      prompt: 'What is the admission procedure and required documents for 2026-2027?',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Courses & Curriculum',
      desc: 'B.Tech, M.Tech, and MBA specializations, intake seats, and academic syllabus.',
      icon: BookOpen,
      prompt: 'What courses are available in this college?',
      color: 'from-sky-500 to-blue-600',
    },
    {
      title: 'Tuition Fees & Loans',
      desc: 'Transparent department-wise annual fees, installment plans & bank financing.',
      icon: Award,
      prompt: 'What are the college fees for different engineering courses?',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Scholarships & Grants',
      desc: 'Chancellor Merit awards, Women in STEM fellowships & post-matric schemes.',
      icon: Award,
      prompt: 'What scholarships and fee waivers are available for students?',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Hostel & Residential Life',
      desc: 'Twin/triple-sharing rooms, Wi-Fi, dining menu, gymnasium & round-the-clock security.',
      icon: Building,
      prompt: 'Is hostel accommodation available and what are the facilities and fees?',
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Placements & Internships',
      desc: '94% placement statistics, top recruitment partners, package details & CRT training.',
      icon: Users,
      prompt: 'What are the placement opportunities and average package in this college?',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 sm:py-24 lg:py-28 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] pointer-events-none"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm dark:bg-brand-950/70 dark:border-brand-800/80 dark:text-brand-300 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>AI-Powered Campus Guide • Grounded in Verified College Database</span>
          </div>

          {/* Heading strictly as specified */}
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white max-w-5xl mx-auto leading-[1.15]">
            Your College Enquiry Assistant –{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500 dark:from-brand-400 dark:to-blue-300">
              Available 24/7
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Get instant, accurate, and verified answers about college admissions, accredited courses, semester fees, scholarships, hostel accommodation, and campus placements — anytime, anywhere, without visiting the administrative office.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-500/35 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="h-5 w-5" />
              Start Chatting Now
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 transition-all"
            >
              <BookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              Explore Courses
            </Link>
          </div>

          {/* Quick metric chips */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="font-heading text-2xl font-bold text-brand-600 dark:text-brand-400">24/7</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Automated AI Assistance</div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="font-heading text-2xl font-bold text-slate-900 dark:text-white">94.2%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Campus Placement Record</div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="font-heading text-2xl font-bold text-slate-900 dark:text-white">₹44.5 LPA</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Highest Salary Package</div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Grounded & Verified Data</div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Enquiry Categories */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Popular Enquiry Topics
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Select any category below to immediately query our AI assistant with preloaded context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleCategoryClick(cat.prompt)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-brand-500/50 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-brand-500/50"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-tr ${cat.color} text-white shadow-md mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                    <span>Ask Chatbot about this</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Application Features Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Built for Modern Students
            </span>
            <h2 className="font-heading mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Why Use Our AI College Assistant?
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              An intelligent, responsive system designed according to strict accuracy and accessibility principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Zero Hallucinations
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The chatbot operates with Retrieval-Augmented Generation (RAG) strictly grounded in database records. It never invents deadlines, fees, or course details.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-5">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                24/7 Zero Wait Time
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant conversational responses whether you query at 2:00 PM or 2:00 AM. No busy phone lines or waiting for office working hours.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 mb-5">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Contextual & Multi-turn
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Maintains conversation context across messages. You can ask follow-up questions regarding fees, installments, or hostel options naturally.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 mb-3">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Instant Clarity</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Quick answers to the most common queries asked by applicants and parents.
            </p>
          </div>

          {loadingFaqs ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={faq._id || idx}
                  className="rounded-xl border border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-850"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                        {idx + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3 leading-relaxed">
                      <p>{faq.answer}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">Category: {faq.category}</span>
                        <button
                          onClick={() => handleCategoryClick(faq.question)}
                          className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
                        >
                          Ask AI follow-up →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-900/60 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Have another question? Ask our AI Chatbot
            </Link>
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="py-12 bg-gradient-to-r from-brand-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between">
          <div className="text-left">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              Ready to learn more about admissions for 2026?
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              Start chatting immediately or connect with our human admissions counseling cell.
            </p>
          </div>
          <div className="mt-6 sm:mt-0 flex gap-3">
            <Link
              to="/chat"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-md hover:bg-blue-50 transition-colors"
            >
              Start Chatting
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Contact Office
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
