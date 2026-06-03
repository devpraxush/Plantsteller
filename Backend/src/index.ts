import { app } from './server.js';
import { connectDatabase } from './config/database.js';
import { loadEnv } from './config/env.js';

const startServer = async () => {
  try {
    // Load environment variables
    loadEnv();

    // Connect to database
    await connectDatabase();
    console.log('✓ Database connected');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
