import { Link } from 'react-router-dom';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldAlert,
  Heart
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 transition-colors dark:border-slate-800 dark:bg-slate-950">
      
      {/* Disclaimer Banner Required by Project Spec */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-center text-xs font-medium text-amber-300">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong>Notice:</strong> Fictional sample college data is displayed for academic demonstration. Do not treat sample fees, deadlines, or admission requirements as verified real-world facts.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-heading text-lg font-bold text-white">Apex Institute</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Autonomous College of Engineering, Technology & Management. Providing 24/7 AI-powered conversational assistance for prospective students and applicants.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-brand-400 border border-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AI Enquiry Assistant Online 24/7
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  AI Chatbot Assistant
                  <span className="rounded bg-brand-500/20 px-1 text-[10px] text-brand-300">Hot</span>
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">Course Offerings</Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-brand-400 transition-colors">Admissions & Eligibility</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Office</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Enquiry Topics */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Popular Queries
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/chat" className="hover:text-brand-400 transition-colors">B.Tech Tuition Fees & Waivers</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-brand-400 transition-colors">Hostel Booking & Mess Charges</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-brand-400 transition-colors">State CET & JEE Cutoff Trends</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-brand-400 transition-colors">Chancellor Merit Scholarships</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-brand-400 transition-colors">Campus Placement Statistics</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Admissions Office
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-brand-400 mt-0.5" />
                <span>Knowledge Park IV, Innovation Corridor, Bangalore - 560100</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <span>+91 (080) 2456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <span>admissions@apexinstitute.edu.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-brand-400 mt-0.5" />
                <span>Mon-Fri: 9:00 AM - 5:00 PM<br />Sat: 9:00 AM - 1:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Apex Institute of Science & Technology. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admissions" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/admissions" className="hover:text-slate-400 transition-colors">Terms of Admission</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Campus Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
