import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';

export default function Contact() {
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get('/college-info');
        if (res.data.success) {
          setCollegeInfo(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load contact info:', err);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await api.post('/enquiries', formData);
      if (res.data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setErrorMessage(res.data.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error('Enquiry submission error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Error communicating with server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 mb-3">
            <Mail className="h-3.5 w-3.5" />
            <span>Connect with Us</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Contact Admissions & Administration
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Have a specialized enquiry? Fill out the form below to reach our counseling staff, or visit our campus during official office hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Official Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-6">
                Institutional Contact Directory
              </h2>

              <ul className="space-y-6 text-sm">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Campus Address</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {collegeInfo?.address || 'Knowledge Park IV, Greater Innovation Corridor, Bangalore, Karnataka - 560100'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Admissions Helpline</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {collegeInfo?.contactPhone || '+91 (080) 2456-7890 / +91 98765-43210'}
                    </p>
                    <span className="text-[10px] text-slate-400">Toll-free student inquiry helpline</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Official Email</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {collegeInfo?.contactEmail || 'admissions@apexinstitute.edu.in'}
                    </p>
                    <span className="text-[10px] text-slate-400">Typical response time: Within 24 hours</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Office Working Hours</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {collegeInfo?.officeHours || 'Monday to Friday: 9:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Campus Tour Notice */}
            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-6 dark:border-brand-950 dark:bg-brand-950/20">
              <h3 className="font-heading text-sm font-bold text-brand-900 dark:text-brand-300 flex items-center gap-2 mb-2">
                <Building className="h-4 w-4" />
                Planning an In-Person Campus Visit?
              </h3>
              <p className="text-xs text-brand-800/80 dark:text-brand-400/80 leading-relaxed">
                Parents and students are welcome for guided campus tours on weekdays between 10:00 AM and 3:00 PM. Please carry a valid photo ID for visitor gate pass generation.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">
                Submit an Official Enquiry
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Our admissions committee reviews and responds to all inquiries in a timely manner.
              </p>

              {submitSuccess && (
                <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-bold">Thank you! Your enquiry has been received.</div>
                    <div className="text-xs mt-1">
                      A representative from our admissions office will reach out to you via your registered email shortly.
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765-43210"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Enquiry Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech Fee Structure & Hostel"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Message / Query *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details about your qualifying score, course of interest, or specific questions..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending Enquiry...' : 'Submit Contact Enquiry'}</span>
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
