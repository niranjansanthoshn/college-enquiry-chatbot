import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  CheckCircle,
  FileCheck2,
  Clock,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function Admissions() {
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissionsData = async () => {
      try {
        const [infoRes, faqRes] = await Promise.all([
          api.get('/college-info'),
          api.get('/faqs?category=Admissions')
        ]);
        if (infoRes.data.success) {
          setCollegeInfo(infoRes.data.data);
        }
        if (faqRes.data.success) {
          setFaqs(faqRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load admissions information:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissionsData();
  }, []);

  const steps = [
    {
      step: '01',
      title: 'Online Registration',
      desc: 'Submit your basic profile and entrance exam rank details (CET/JEE/GATE/CAT) on our official portal.',
    },
    {
      step: '02',
      title: 'Document Verification',
      desc: 'Upload scanned copies of 10th/12th marks cards, identity proof, and category certificates for merit verification.',
    },
    {
      step: '03',
      title: 'Counselling & Seat Allocation',
      desc: 'Attend state counseling or direct institutional round for preferred branch selection based on merit ranks.',
    },
    {
      step: '04',
      title: 'Fee Payment & Enrollment',
      desc: 'Complete fee payment (lump-sum or installment) to confirm provisional admission and receive campus ID card.',
    },
  ];

  const requiredDocuments = [
    '10th Standard / SSLC Equivalent Certificate (Proof of Date of Birth)',
    '12th Standard / Pre-University Certificate with Physics, Mathematics & Chemistry marks',
    'State CET / JEE Main / GATE / CAT Official Scorecard & Rank Card',
    'Transfer Certificate (TC) and Migration Certificate from the institution last attended',
    'Valid Government Photo ID Card (Aadhaar Card / Passport)',
    'Caste / Income / EWS Certificate (Mandatory for fee waiver and scholarship claimants)',
    'Five recent passport-size colored photographs with white background',
    'Medical Fitness Certificate verified by a Registered Medical Practitioner',
  ];

  const dates = [
    { event: 'Online Application Portal Opens', date: 'May 15, 2026', status: 'Upcoming' },
    { event: 'Last Date for First Round Applications', date: 'June 30, 2026', status: 'Active' },
    { event: 'First Merit List & Counselling Round', date: 'July 10, 2026', status: 'Scheduled' },
    { event: 'Commencement of Academic Semester 1', date: 'August 18, 2026', status: 'Scheduled' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 mb-3">
            <FileText className="h-3.5 w-3.5" />
            <span>Admissions Hub 2026-2027</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Admissions & Eligibility
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about joining Apex Institute: entry criteria, step-by-step enrollment, required certificates, and key academic dates.
          </p>
        </div>

        {/* Official Admission Guidelines Card (Managed via Admin) */}
        <div className="mb-12 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm dark:border-brand-900/60 dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Official Institutional Admission Policy
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {collegeInfo?.admissionInformation ||
                  'Admissions for undergraduate and postgraduate courses are conducted annually based on entrance examination scores (State CET/JEE/GATE/CAT) and merit counseling.'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 font-semibold">
                <span>Verified by Apex Admissions Committee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Procedure */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              4-Step Application Procedure
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Follow this streamlined roadmap from initial application to final classroom orientation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div
                key={st.step}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="font-heading text-3xl font-extrabold text-brand-600/30 dark:text-brand-400/30 mb-2">
                  {st.step}
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents & Important Dates 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Required Documents Checklist */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2.5 mb-5">
              <FileCheck2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Mandatory Verification Documents
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Ensure you possess original documents and two attested photocopy sets during counseling verification:
            </p>
            <ul className="space-y-3">
              {requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Dates Calendar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <Calendar className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Admission Schedule (2026-2027)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Mark your calendar for all primary deadlines and counseling rounds:
              </p>
              <div className="space-y-4">
                {dates.map((dt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-750"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{dt.event}</div>
                      <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium mt-0.5">
                        {dt.date}
                      </div>
                    </div>
                    <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {dt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admissions Office Contact Summary */}
            <div className="mt-8 rounded-xl bg-blue-50/70 p-4 border border-blue-200/60 dark:bg-brand-950/30 dark:border-brand-900/40 text-xs">
              <div className="font-bold text-slate-900 dark:text-white mb-1">
                Need Help with your Application?
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                Our admissions helpdesk is available via phone and email:
              </p>
              <div className="font-medium text-slate-800 dark:text-slate-200 space-y-1">
                <div>📞 {collegeInfo?.contactPhone || '+91 (080) 2456-7890'}</div>
                <div>✉️ {collegeInfo?.contactEmail || 'admissions@apexinstitute.edu.in'}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Frequently Asked Admission Questions */}
        {faqs.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-12">
            <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              Admission FAQs
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-none">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Q: {faq.question}
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
