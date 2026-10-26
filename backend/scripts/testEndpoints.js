const app = require('../src/app');
const mongoose = require('mongoose');
const config = require('../src/config/env');
const connectDB = require('../src/config/db');

// Test runner function
const runIntegrationTests = async () => {
  console.log('--- Starting API Integration Tests ---');
  await connectDB();

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let studentToken = '';
  let adminToken = '';
  let conversationId = '';

  const assert = (condition, message) => {
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`✅ PASSED: ${message}`);
  };

  try {
    // 1. Health check
    console.log('\n[1] Testing Health Endpoint...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'online', 'Health endpoint is online');

    // 2. Student Login
    console.log('\n[2] Testing Student Login...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@apex.edu', password: 'Student@12345' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success, 'Student login succeeded');
    assert(loginData.user.role === 'student', 'Student has student role');
    studentToken = loginData.token;

    // 3. Admin Login
    console.log('\n[3] Testing Admin Login...');
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@apex.edu', password: 'Admin@12345' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.success, 'Admin login succeeded');
    assert(adminLoginData.user.role === 'admin', 'Admin has admin role');
    adminToken = adminLoginData.token;

    // 4. Test Course Listing & Search
    console.log('\n[4] Testing Courses Endpoint...');
    const coursesRes = await fetch(`${baseUrl}/api/courses`);
    const coursesData = await coursesRes.json();
    assert(coursesRes.status === 200 && coursesData.data.length >= 5, 'Retrieved active courses list');

    const searchRes = await fetch(`${baseUrl}/api/courses?search=intelligence`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200 && searchData.data.some(c => c.name.includes('Artificial Intelligence')), 'Course search by keyword works');

    // 5. Test College Info
    console.log('\n[5] Testing College Info Endpoint...');
    const infoRes = await fetch(`${baseUrl}/api/college-info`);
    const infoData = await infoRes.json();
    assert(infoRes.status === 200 && infoData.data.collegeName.includes('Apex Institute'), 'College Info retrieved successfully');

    // 6. Test FAQs
    console.log('\n[6] Testing FAQs Endpoint...');
    const faqsRes = await fetch(`${baseUrl}/api/faqs`);
    const faqsData = await faqsRes.json();
    assert(faqsRes.status === 200 && faqsData.data.length >= 10, 'Retrieved 10+ FAQs');

    // 7. Test Chatbot Endpoint
    console.log('\n[7] Testing Chatbot Endpoint...');
    const chatRes = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        message: 'What are the college fees for computer science?'
      })
    });
    const chatData = await chatRes.json();
    assert(chatRes.status === 200 && chatData.success, 'Chat endpoint processed message');
    assert(chatData.data.message.content.length > 20, 'Chatbot provided a grounded answer');
    conversationId = chatData.data.conversationId;
    console.log(`Bot Response: "${chatData.data.message.content.substring(0, 80)}..."`);

    // 8. Test Chat History Retrieval
    console.log('\n[8] Testing Chat History...');
    const historyRes = await fetch(`${baseUrl}/api/chat/history`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const historyData = await historyRes.json();
    assert(historyRes.status === 200 && historyData.data.length >= 1, 'Student chat history retrieved');

    // 9. Test Contact Enquiry Submission
    console.log('\n[9] Testing Contact Enquiry Submission...');
    const enquiryRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Candidate',
        email: 'test.candidate@gmail.com',
        phone: '+91 9988776655',
        subject: 'Hostel fee query',
        message: 'Is internet Wi-Fi available in hostel rooms?'
      })
    });
    const enquiryData = await enquiryRes.json();
    assert(enquiryRes.status === 201 && enquiryData.success, 'Enquiry submitted successfully');

    // 10. Test Role Authorization Protection
    console.log('\n[10] Testing Authorization Protection...');
    // Student attempting to access admin analytics must receive 403 Forbidden
    const forbiddenRes = await fetch(`${baseUrl}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(forbiddenRes.status === 403, 'Unauthorized student blocked from admin analytics (403)');

    // Admin accessing admin analytics must succeed
    const adminAnalyticsRes = await fetch(`${baseUrl}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminAnalyticsData = await adminAnalyticsRes.json();
    assert(adminAnalyticsRes.status === 200 && adminAnalyticsData.success, 'Admin successfully accessed analytics');
    assert(adminAnalyticsData.data.summary.totalCourses >= 5, 'Admin analytics summary counts verified');

    console.log('\n====================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED PERFECTLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
};

runIntegrationTests();
