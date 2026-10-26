const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`🚀 College Enquiry Chatbot Server Running!`);
    console.log(`📍 Port: ${config.port}`);
    console.log(`🌐 Environment: ${config.nodeEnv}`);
    console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`🤖 AI Provider: ${config.aiProvider} (${config.geminiApiKey ? 'API Key Configured' : 'Demo/RAG Mode Active'})`);
    console.log(`====================================================`);
  });

  // Graceful shutdown
  const handleShutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Closing server gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
