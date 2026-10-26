const mongoose = require('mongoose');

const collegeInfoSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: true,
      default: 'Apex Institute of Science & Technology'
    },
    tagline: {
      type: String,
      default: 'Excellence in Engineering, Technology & Management'
    },
    address: {
      type: String,
      required: true,
      default: 'Knowledge Park IV, Greater Innovation Corridor, Bangalore, Karnataka - 560100'
    },
    contactEmail: {
      type: String,
      required: true,
      default: 'admissions@apexinstitute.edu.in'
    },
    contactPhone: {
      type: String,
      required: true,
      default: '+91 (080) 2456-7890 / +91 98765-43210'
    },
    officeHours: {
      type: String,
      default: 'Monday to Friday: 9:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM (Closed on Sundays & Public Holidays)'
    },
    admissionInformation: {
      type: String,
      required: true,
      default: 'Admissions for undergraduate and postgraduate courses are conducted annually based on entrance examination scores (State CET/JEE/GATE/CAT) and merit counseling. Online applications open in May each year.'
    },
    feeInformation: {
      type: String,
      required: true,
      default: 'Tuition fees range from ₹75,000 to ₹1,25,000 per year depending on the program. Merit scholarships provide up to 50% waiver on tuition. Installment payment plans are available.'
    },
    scholarshipInformation: {
      type: String,
      required: true,
      default: 'Merit-cum-means scholarships are provided for students with >85% in qualifying exams. Government post-matric scholarships for SC/ST/OBC and girl-child STEM scholarships are fully supported.'
    },
    hostelInformation: {
      type: String,
      required: true,
      default: 'Separate secure hostels for boys and girls on campus with high-speed Wi-Fi, 24/7 security, hygienic dining, medical center, gymnasium, and indoor sports facilities. Annual fee: ₹65,000 (includes food and lodging).'
    },
    placementInformation: {
      type: String,
      required: true,
      default: 'Over 94% placement record across departments. Top recruiters include Google, Microsoft, Infosys, TCS, Cognizant, Wipro, and L&T. Highest package: ₹44 LPA, Average package: ₹7.8 LPA.'
    },
    campusFacilities: {
      type: [String],
      default: [
        'Advanced Robotics and AI Lab',
        'Central Library with over 50,000 volumes and IEEE digital access',
        'Olympic-sized Swimming Pool & Multi-sport Ground',
        'Cafeteria with multi-cuisine dining options',
        'Auditorium with 1,200 seating capacity',
        '24/7 Health Center with resident ambulance'
      ]
    }
  },
  {
    timestamps: true
  }
);

const CollegeInfo = mongoose.model('CollegeInfo', collegeInfoSchema);
module.exports = CollegeInfo;
