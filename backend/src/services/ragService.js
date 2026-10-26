const Course = require('../models/Course');
const FAQ = require('../models/FAQ');
const CollegeInfo = require('../models/CollegeInfo');
const KnowledgeItem = require('../models/KnowledgeItem');

/**
 * Categorize user query based on intent keywords
 */
const detectCategory = (query) => {
  const q = query.toLowerCase();
  if (/admiss|apply|eligib|counsel|cut-off|cutoff|entrance|seat|quota|document|date/i.test(q)) {
    return 'Admissions';
  }
  if (/fee|cost|tuition|charge|payment|installment|expense|how much/i.test(q)) {
    return 'Fees';
  }
  if (/scholarship|financial aid|waiver|stipend|concession|freeread/i.test(q)) {
    return 'Scholarships';
  }
  if (/course|program|degree|b\.?tech|m\.?tech|mba|computer science|ai|mechanical|department|branch|curriculum/i.test(q)) {
    return 'Courses';
  }
  if (/hostel|room|mess|stay|accommodation|boarding|living|food|canteen/i.test(q)) {
    return 'Hostel';
  }
  if (/placement|package|lpa|recruit|job|internship|career|company|hiring|salary/i.test(q)) {
    return 'Placements';
  }
  if (/exam|semester|grading|mark|result|schedule|sgpa|cgpa/i.test(q)) {
    return 'Examinations';
  }
  if (/contact|phone|email|address|office|reach|visit|location|where/i.test(q)) {
    return 'General';
  }
  return 'General';
};

/**
 * Extract keywords ignoring common stop words
 */
const extractKeywords = (query) => {
  const stopWords = new Set([
    'what', 'is', 'are', 'the', 'a', 'an', 'in', 'of', 'for', 'to', 'how',
    'can', 'i', 'get', 'about', 'and', 'or', 'do', 'does', 'tell', 'me', 'please',
    'there', 'any', 'college', 'this', 'have', 'much'
  ]);
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

/**
 * Retrieve verified context from Database (Courses, FAQs, College Info, Knowledge Items)
 */
const retrieveVerifiedContext = async (userMessage) => {
  const category = detectCategory(userMessage);
  const keywords = extractKeywords(userMessage);
  const regexPatterns = keywords.map(kw => new RegExp(kw, 'i'));

  const contextItems = [];
  const sources = [];

  // 1. Fetch official College Info
  try {
    const collegeInfo = await CollegeInfo.findOne().lean();
    if (collegeInfo) {
      if (category === 'Admissions' || /admiss|apply/i.test(userMessage)) {
        contextItems.push(`[College Admission Policy]: ${collegeInfo.admissionInformation}`);
        sources.push('Official Admission Guidelines');
      }
      if (category === 'Fees' || /fee|cost|tuition/i.test(userMessage)) {
        contextItems.push(`[College Fee Structure]: ${collegeInfo.feeInformation}`);
        sources.push('Verified Fee Schedule');
      }
      if (category === 'Scholarships' || /scholarship|aid/i.test(userMessage)) {
        contextItems.push(`[College Scholarships]: ${collegeInfo.scholarshipInformation}`);
        sources.push('Scholarship & Financial Aid Cell');
      }
      if (category === 'Hostel' || /hostel|mess|room/i.test(userMessage)) {
        contextItems.push(`[Hostel Facilities]: ${collegeInfo.hostelInformation}`);
        sources.push('Campus Residence & Housing Office');
      }
      if (category === 'Placements' || /placement|package|job/i.test(userMessage)) {
        contextItems.push(`[Placement Record]: ${collegeInfo.placementInformation}`);
        sources.push('Corporate Relations & Placement Cell');
      }
      if (/contact|phone|email|address|hours|where/i.test(userMessage)) {
        contextItems.push(`[College Contact]: Address: ${collegeInfo.address}. Email: ${collegeInfo.contactEmail}. Phone: ${collegeInfo.contactPhone}. Office Hours: ${collegeInfo.officeHours}`);
        sources.push('Administrative Contact Office');
      }
    }
  } catch (err) {
    console.error('RAG CollegeInfo retrieval error:', err.message);
  }

  // 2. Fetch relevant Courses
  try {
    const courseQuery = { active: true };
    if (keywords.length > 0) {
      courseQuery.$or = [
        { name: { $in: regexPatterns } },
        { department: { $in: regexPatterns } },
        { courseCode: { $in: regexPatterns } },
        { description: { $in: regexPatterns } }
      ];
    }
    const matchedCourses = await Course.find(courseQuery).limit(4).lean();
    if (matchedCourses && matchedCourses.length > 0) {
      matchedCourses.forEach(c => {
        contextItems.push(`[Course - ${c.name} (${c.courseCode})]: Department: ${c.department}, Duration: ${c.duration}, Eligibility: ${c.eligibility}, Annual Fees: ${c.fees}, Intake Seats: ${c.seats || 'Verified'}, Description: ${c.description}`);
        sources.push(`Course Catalog: ${c.name}`);
      });
    } else if (category === 'Courses' || /all courses|what courses|list of courses/i.test(userMessage)) {
      const allActive = await Course.find({ active: true }).limit(8).lean();
      allActive.forEach(c => {
        contextItems.push(`[Course - ${c.name} (${c.courseCode})]: Dept: ${c.department}, Duration: ${c.duration}, Fees: ${c.fees}, Eligibility: ${c.eligibility}`);
        sources.push(`Course Catalog: ${c.name}`);
      });
    }
  } catch (err) {
    console.error('RAG Course retrieval error:', err.message);
  }

  // 3. Fetch relevant FAQs
  try {
    let faqQuery = { active: true };
    if (keywords.length > 0) {
      faqQuery.$or = [
        { question: { $in: regexPatterns } },
        { answer: { $in: regexPatterns } },
        { category: category }
      ];
    } else {
      faqQuery.category = category;
    }
    const matchedFaqs = await FAQ.find(faqQuery).limit(4).lean();
    matchedFaqs.forEach(f => {
      contextItems.push(`[Verified FAQ - Q: "${f.question}"]: Answer: "${f.answer}" (Category: ${f.category})`);
      sources.push(`FAQ: ${f.question.slice(0, 40)}...`);
    });
  } catch (err) {
    console.error('RAG FAQ retrieval error:', err.message);
  }

  // 4. Fetch relevant Knowledge Base Items
  try {
    const kbQuery = { active: true };
    if (keywords.length > 0) {
      kbQuery.$or = [
        { title: { $in: regexPatterns } },
        { content: { $in: regexPatterns } },
        { category: category }
      ];
    }
    const matchedKb = await KnowledgeItem.find(kbQuery).limit(3).lean();
    matchedKb.forEach(k => {
      contextItems.push(`[Knowledge Base - ${k.title}]: ${k.content}`);
      sources.push(`Knowledge Base: ${k.title}`);
    });
  } catch (err) {
    console.error('RAG KnowledgeItem retrieval error:', err.message);
  }

  return {
    category,
    contextString: contextItems.join('\n\n'),
    contextItems,
    sources: [...new Set(sources)]
  };
};

module.exports = {
  detectCategory,
  extractKeywords,
  retrieveVerifiedContext
};
