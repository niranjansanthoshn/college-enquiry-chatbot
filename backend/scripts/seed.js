const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../src/config/env');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const FAQ = require('../src/models/FAQ');
const CollegeInfo = require('../src/models/CollegeInfo');
const Enquiry = require('../src/models/Enquiry');
const KnowledgeItem = require('../src/models/KnowledgeItem');
const ChatConversation = require('../src/models/ChatConversation');

const sampleCollegeInfo = {
  collegeName: 'Apex Institute of Science & Technology (AIST)',
  tagline: 'Empowering Next-Gen Innovators, Engineers & Global Leaders',
  address: 'Knowledge Park IV, Greater Innovation Corridor, Bangalore, Karnataka - 560100',
  contactEmail: 'admissions@apexinstitute.edu.in',
  contactPhone: '+91 (080) 2456-7890 / +91 98765-43210',
  officeHours: 'Monday to Friday: 9:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM (Closed on Sundays & Gazetted Holidays)',
  admissionInformation: `Admissions to undergraduate B.Tech programs are offered through State Common Entrance Test (CET), JEE Main scores, and institutional management quota.
Applications for the academic year 2026-2027 open online on May 15, 2026.
Eligibility: Minimum 60% aggregate in 10+2 with Physics, Mathematics, and Chemistry/Computer Science.
Postgraduate admissions (M.Tech/MBA) require valid GATE/CAT/MAT scores or Institutional Aptitude Test.
Documents required during admission: 10th and 12th Marks cards, Transfer Certificate, Migration Certificate, Entrance Rank Card, Identity Proof (Aadhaar), and 4 passport-size photographs.`,
  feeInformation: `Verified Annual Fee Structure (Academic Year 2026-2027):
• B.Tech in Computer Science & Engineering: ₹1,15,000 per annum
• B.Tech in Artificial Intelligence & Machine Learning: ₹1,20,000 per annum
• B.Tech in Electronics & Communication: ₹95,000 per annum
• B.Tech in Mechanical Engineering: ₹85,000 per annum
• Master of Business Administration (MBA): ₹1,30,000 per annum
• M.Tech in Data Science & Cloud Computing: ₹90,000 per annum
Installment facility: Tuition fees can be paid in two equal semester installments. Zero-interest education loan assistance is partnered with major nationalized banks.`,
  scholarshipInformation: `Apex Merit & Need-Based Scholarships:
1. Apex Chancellor's Merit Award: 50% tuition waiver for students scoring above 95% in 10+2 or top 500 in State CET.
2. Women in STEM Excellence Fellowship: 25% tuition waiver for high-achieving female engineering applicants.
3. Sports & Cultural Luminary Quota: Up to 40% waiver for national/state level sports participants.
4. Government Post-Matric Schemes: Complete processing support for SC/ST/OBC/EWS state and central welfare grants.`,
  hostelInformation: `Secure Residential Accommodation on Campus:
• Twin-sharing and triple-sharing air-cooled rooms for 1,200+ boys and 900+ girls in independent residential towers.
• Amenities: 24/7 biometric security, high-speed Wi-Fi, laundry facilities, study lounges, indoor badminton courts, and fitness gymnasium.
• Dining: Four-meal nutritional dining plan (Breakfast, Lunch, Evening Snacks, Dinner) offering both North & South Indian vegetarian and non-vegetarian selections.
• Annual Hostel Fee: ₹68,000 (standard twin-sharing) inclusive of food, utilities, and maintenance.`,
  placementInformation: `Placement & Career Development Highlights:
• Highest Placement Package (2025-2026): ₹44.5 LPA (Offered by global tech giant)
• Average Compensation Package: ₹7.8 LPA
• Overall Placement Percentage: 94.2% across engineering and management departments.
• Prominent Hiring Partners: Google, Microsoft, Amazon, Infosys, Tata Consultancy Services, Cognizant, Wipro, L&T Technology, Cisco, Deloitte, and Texas Instruments.
• Pre-placement training begins in the 5th semester, covering Data Structures, System Design, Soft Skills, and Mock Interviews.`,
  campusFacilities: [
    'NVIDIA GPU-Powered Deep Learning & Artificial Intelligence Center',
    'Robotics and IoT Innovation Fabrication Lab (Makerspace)',
    'Fully Automated Central Library with 60,000+ volumes, IEEE, and Springer access',
    'Semi-Olympic Swimming Pool, Synthetic Basketball & Tennis Courts',
    'Multicuisine Food Court & Cafeteria with seating for 800 students',
    'Auditorium with 1,200 seating capacity and 4K digital projection',
    '24/7 Emergency Health Center staffed by resident doctors and dedicated ambulance'
  ]
};

const sampleCourses = [
  {
    name: 'B.Tech in Computer Science & Engineering',
    courseCode: 'CSE-101',
    department: 'Computer Science',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with minimum 60% aggregate in Physics, Mathematics, and Chemistry/CS + CET/JEE score',
    fees: '₹1,15,000 per year',
    seats: 180,
    description: 'Comprehensive program covering Algorithms, Cloud Computing, Full-Stack Web Development, Distributed Systems, and Cybersecurity. Includes mandatory industry internships.',
    active: true
  },
  {
    name: 'B.Tech in Artificial Intelligence & Machine Learning',
    courseCode: 'AIML-102',
    department: 'Artificial Intelligence',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with minimum 65% aggregate in PCM + CET/JEE rank',
    fees: '₹1,20,000 per year',
    seats: 120,
    description: 'Cutting-edge curriculum focused on Deep Learning, Natural Language Processing, Computer Vision, Autonomous Robotics, and Generative AI frameworks.',
    active: true
  },
  {
    name: 'B.Tech in Electronics & Communication Engineering',
    courseCode: 'ECE-103',
    department: 'Electronics',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with 60% in Physics and Mathematics',
    fees: '₹95,000 per year',
    seats: 120,
    description: 'Specialized training in Embedded Systems, VLSI Design, IoT sensors, 5G Wireless Communications, and Signal Processing with state-of-the-art semiconductor labs.',
    active: true
  },
  {
    name: 'B.Tech in Mechanical Engineering',
    courseCode: 'ME-104',
    department: 'Mechanical Engineering',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with 55% in PCM from recognized board',
    fees: '₹85,000 per year',
    seats: 60,
    description: 'Core engineering curriculum integrating CAD/CAM, Mechatronics, Electric Vehicle Systems, Thermodynamics, and Industrial Automation.',
    active: true
  },
  {
    name: 'Master of Business Administration (MBA)',
    courseCode: 'MBA-201',
    department: 'Management Studies',
    duration: '2 Years (4 Semesters)',
    eligibility: "Bachelor's degree with minimum 50% marks in any discipline + valid CAT/MAT/State PGCET score",
    fees: '₹1,30,000 per year',
    seats: 90,
    description: 'Dual specialization available in Marketing, Finance, Human Resources, Business Analytics, and Supply Chain Management with executive mentorship.',
    active: true
  },
  {
    name: 'M.Tech in Data Science & Cloud Computing',
    courseCode: 'MDS-202',
    department: 'Computer Science',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.E./B.Tech in CSE/IT/ECE with minimum 55% aggregate or valid GATE score',
    fees: '₹90,000 per year',
    seats: 30,
    description: 'Advanced research-driven postgraduate degree emphasizing Big Data Engineering, Deep Neural Networks, Cloud Microservices, and MLOps pipelines.',
    active: true
  }
];

const sampleFaqs = [
  {
    question: 'What courses are available in this college?',
    answer: 'Apex Institute offers undergraduate B.Tech degrees in Computer Science, AI & ML, Electronics & Communication, and Mechanical Engineering, as well as postgraduate programs including MBA and M.Tech in Data Science.',
    category: 'Courses',
    clickCount: 142,
    active: true
  },
  {
    question: 'What is the admission procedure?',
    answer: 'Undergraduate admissions are conducted through State CET counseling, JEE Main scores, and institutional merit quota. Applications open on May 15, 2026. You can submit an online application on our portal followed by document verification.',
    category: 'Admissions',
    clickCount: 185,
    active: true
  },
  {
    question: 'What are the college fees?',
    answer: 'Annual tuition fees range between ₹85,000 (Mechanical) to ₹1,20,000 (AI & ML) for B.Tech programs. The MBA tuition fee is ₹1,30,000 per annum. Tuition fees can be paid in semester-wise installments.',
    category: 'Fees',
    clickCount: 210,
    active: true
  },
  {
    question: 'What scholarships are available?',
    answer: 'We provide Chancellor Merit Scholarships (up to 50% tuition waiver for >95% marks), Women in STEM Excellence Fellowships (25% waiver), Sports & Cultural quotas, and complete facilitation for State/Central Government Post-Matric welfare grants.',
    category: 'Scholarships',
    clickCount: 130,
    active: true
  },
  {
    question: 'Is hostel accommodation available?',
    answer: 'Yes, separate fully furnished residential halls are available for both male and female students on campus. Facilities include 24/7 security, high-speed Wi-Fi, gymnasium, and a full 4-meal daily dining plan. The annual hostel fee is ₹68,000 inclusive of meals.',
    category: 'Hostel',
    clickCount: 154,
    active: true
  },
  {
    question: 'What are the placement opportunities?',
    answer: 'Apex maintains an outstanding 94.2% placement record. For the recent 2025-2026 batch, the highest package reached ₹44.5 LPA and the average package was ₹7.8 LPA. Major recruiters include Google, Microsoft, Amazon, Infosys, and TCS.',
    category: 'Placements',
    clickCount: 198,
    active: true
  },
  {
    question: 'What documents are required for admission?',
    answer: 'Required documents: 1. 10th & 12th standard mark sheets, 2. Entrance exam rank card (CET/JEE/GATE/CAT), 3. Transfer & Migration certificates, 4. Category/Caste certificate (if applicable), 5. Valid government ID (Aadhaar), and 6. 4 passport-size photographs.',
    category: 'Admissions',
    clickCount: 95,
    active: true
  },
  {
    question: 'How can I contact the college office?',
    answer: 'You can visit our admissions office in person Monday to Friday (9:00 AM - 5:00 PM) and Saturday (9:00 AM - 1:00 PM), or email admissions@apexinstitute.edu.in. You can also reach our helpline at +91 (080) 2456-7890.',
    category: 'General',
    clickCount: 88,
    active: true
  },
  {
    question: 'Are installment options available for paying tuition fees?',
    answer: 'Yes, students may choose to pay their tuition fees in two equal semester installments. In addition, our accounts office provides tie-up support with national banks for zero-interest educational financing.',
    category: 'Fees',
    clickCount: 64,
    active: true
  },
  {
    question: 'Is bus transportation provided for day scholars?',
    answer: 'Yes, our institutional fleet of 35 air-conditioned buses covers all primary residential hubs and metro stations across the metropolitan region with GPS tracking and student safety monitors.',
    category: 'General',
    clickCount: 72,
    active: true
  },
  {
    question: 'When do odd and even semester examinations take place?',
    answer: 'Odd semester examinations take place in December-January, while even semester examinations are conducted in May-June. Mid-term assessments are scheduled every 6 weeks throughout the semester.',
    category: 'Examinations',
    clickCount: 53,
    active: true
  },
  {
    question: 'Can undergraduate students participate in research projects?',
    answer: 'Yes! Our campus hosts funded Center of Excellence research labs in Robotics, AI, and Clean Energy where students can collaborate with faculty mentors starting from their 2nd year.',
    category: 'Courses',
    clickCount: 47,
    active: true
  }
];

const sampleKnowledgeItems = [
  {
    title: 'Admissions Cutoff Trends & Eligibility Matrix',
    category: 'Admissions',
    content: 'State CET general merit cutoff for Computer Science is typically within the top 6,500 ranks. AI & ML ranks close around 8,200. ECE closes around 14,000. Institutional merit seats consider 10+2 PCM marks (minimum 75% recommended).',
    tags: ['cutoffs', 'ranks', 'cet', 'jee', 'eligibility'],
    active: true
  },
  {
    title: 'Hostel Mess Menu and Nutritional Policy',
    category: 'Hostel',
    content: 'The hostel kitchen is certified for high hygiene standards. Daily menu rotates weekly offering breakfast (idli, dosa, poha, paratha), lunch (rice, roti, dal, paneer/chicken curry, curd), high-tea snacks, and dinner with desserts twice a week.',
    tags: ['food', 'mess', 'hygiene', 'dining', 'hostel'],
    active: true
  },
  {
    title: 'Placement Training & Internship Mandate',
    category: 'Placements',
    content: 'All engineering students undergo 200 hours of dedicated campus recruitment training (CRT) starting in semester 5. A mandatory 8-week summer internship is required between semesters 6 and 7.',
    tags: ['crt', 'internships', 'training', 'careers'],
    active: true
  }
];

const sampleEnquiries = [
  {
    name: 'Rohan Sharma',
    email: 'rohan.sharma99@gmail.com',
    phone: '+91 98450-11223',
    subject: 'B.Tech AI & ML Management Quota Inquiry',
    message: 'Hello, I scored 88% in 10+2 and would like to know the seat availability and admission fees under institutional quota for AI & ML.',
    status: 'pending',
    internalNotes: ''
  },
  {
    name: 'Pooja Venkatesh',
    email: 'pooja.v2026@outlook.com',
    phone: '+91 97412-44556',
    subject: 'Hostel Accommodation for Girls',
    message: 'Can you please confirm if twin-sharing rooms are available for incoming first-year girls and what the check-in date is for the upcoming semester?',
    status: 'in-progress',
    internalNotes: 'Admissions desk called candidate on 24th Oct. Follow up with hostel warden.'
  },
  {
    name: 'Karthik Menon',
    email: 'karthik.menon@gmail.com',
    phone: '+91 91234-56789',
    subject: 'Scholarship Details for CET rank under 1000',
    message: 'I secured rank 720 in State CET. Please let me know how I can apply for the Chancellor Merit Award for 50% tuition waiver.',
    status: 'resolved',
    internalNotes: 'Verification completed. Merit award approved for Semester 1.'
  }
];

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seeder] Connected successfully. Initializing data...');

    // 1. Seed Users (Admin & Student)
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);

    const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);
    const studentPasswordHash = await bcrypt.hash('Student@12345', salt);

    const adminUser = await User.create({
      name: 'Dr. Rajesh Nair (Dean / Admin)',
      email: 'admin@apex.edu',
      passwordHash: adminPasswordHash,
      role: 'admin'
    });

    const studentUser = await User.create({
      name: 'Ananya Deshmukh',
      email: 'student@apex.edu',
      passwordHash: studentPasswordHash,
      role: 'student'
    });

    console.log(`[Seeder] Created Admin: ${adminUser.email} (Password: Admin@12345)`);
    console.log(`[Seeder] Created Student: ${studentUser.email} (Password: Student@12345)`);

    // 2. Seed College Information
    await CollegeInfo.deleteMany({});
    await CollegeInfo.create(sampleCollegeInfo);
    console.log('[Seeder] Created College Information singleton.');

    // 3. Seed Courses
    await Course.deleteMany({});
    await Course.insertMany(sampleCourses);
    console.log(`[Seeder] Created ${sampleCourses.length} academic courses.`);

    // 4. Seed FAQs
    await FAQ.deleteMany({});
    await FAQ.insertMany(sampleFaqs);
    console.log(`[Seeder] Created ${sampleFaqs.length} categorized FAQs.`);

    // 5. Seed Knowledge Base Items
    await KnowledgeItem.deleteMany({});
    await KnowledgeItem.insertMany(sampleKnowledgeItems);
    console.log(`[Seeder] Created ${sampleKnowledgeItems.length} knowledge base items.`);

    // 6. Seed Sample Enquiries
    await Enquiry.deleteMany({});
    await Enquiry.insertMany(sampleEnquiries);
    console.log(`[Seeder] Created ${sampleEnquiries.length} sample contact enquiries.`);

    // 7. Seed Sample Chat Conversation for Student
    await ChatConversation.deleteMany({});
    await ChatConversation.create({
      userId: studentUser._id,
      sessionId: 'seed-session-101',
      title: 'Enquiry on B.Tech AI & ML Admissions',
      category: 'Admissions',
      messages: [
        {
          role: 'user',
          content: 'What is the eligibility and annual fee for B.Tech in Artificial Intelligence?',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          role: 'assistant',
          content: 'For B.Tech in Artificial Intelligence & Machine Learning (AIML-102), the eligibility requirement is 10+2 with a minimum 65% aggregate in Physics, Chemistry, and Mathematics (PCM), along with a valid CET or JEE score.\n\nThe verified annual tuition fee is ₹1,20,000 per year, which can be paid in semester-wise installments.',
          sources: ['Course Catalog: B.Tech in Artificial Intelligence & Machine Learning', 'Verified Fee Schedule'],
          isDemoMode: true,
          timestamp: new Date(Date.now() - 3590000)
        }
      ]
    });
    console.log('[Seeder] Created sample chat conversation.');

    console.log('====================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
