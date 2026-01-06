async function initializeServices() {
  // Validate critical API keys before initialization
  const requiredKeys = ['GEMINI_API_KEY', 'PIMLICO_API_KEY'];
  const missingKeys = requiredKeys.filter(key => !process.env[key]);

  if (missingKeys.length > 0) {
    logger.error(`❌ CRITICAL: Missing required API keys: ${missingKeys.join(', ')}`);
    logger.error('Please ensure API keys are properly configured in environment variables');
    logger.error('For local development: check .env.local file');
    logger.error('For production: check Render service secrets');
    process.exit(1); // Exit with error to prevent startup with missing keys
  }

  logger.info('✅ API key validation passed');

  try {
    await aiService.initialize();
    aiService.isReady = true;
    logger.info('AI service initialized successfully');
  } catch (error) {
    logger.error('AI service initialization failed:', error);
    logger.error('This may be due to invalid GEMINI_API_KEY or network issues');
    // Don't exit - allow partial functionality
  }

  try {
    await blockchainService.initialize();
    blockchainService.isConnected = true;
    logger.info('Blockchain service initialized successfully');

    // Activate Tri-Tier Bot System
    botOrchestrator.start();
    logger.info('Tri-Tier Bot System activated');
  } catch (error) {
    logger.error('Blockchain service initialization failed:', error);
    logger.error('This may be due to invalid PIMLICO_API_KEY, RPC URLs, or network connectivity');
    logger.error('Available environment variables:', Object.keys(process.env).filter(key =>
      key.includes('API') || key.includes('RPC') || key.includes('POOL') || key.includes('ROUTER')
    ));
    // Don't exit - allow partial functionality but log prominently
  }
}
=======
// Initialize services with enhanced error handling and API key validation
async function initializeServices() {
  // Validate critical API keys before initialization
  const requiredKeys = ['GEMINI_API_KEY', 'PIMLICO_API_KEY'];
  const missingKeys = requiredKeys.filter(key => !process.env[key] || process.env[key] === 'your_gemini_api_key_here' || process.env[key] === 'your_pimlico_api_key_here');

  if (missingKeys.length > 0) {
    logger.warn(`⚠️ WARNING: Missing or placeholder API keys detected: ${missingKeys.join(', ')}`);
    logger.warn('The server will start but some features may not work properly.');
    logger.warn('To get full functionality:');
    logger.warn('- Get GEMINI_API_KEY from: https://makersuite.google.com/app/apikey');
    logger.warn('- Get PIMLICO_API_KEY from: https://dashboard.pimlico.io/');
    logger.warn('Update these values in the .env file and restart the server.');
    // Don't exit - allow server to start for development/testing
  } else {
    logger.info('✅ API key validation passed');
  }

  try {
    await aiService.initialize();
    aiService.isReady = true;
    logger.info('AI service initialized successfully');
  } catch (error) {
    logger.error('AI service initialization failed:', error);
    logger.error('This may be due to invalid GEMINI_API_KEY or network issues');
    logger.warn('AI features will be disabled until API key is configured');
    // Don't exit - allow partial functionality
  }

  try {
    await blockchainService.initialize();
    blockchainService.isConnected = true;
    logger.info('Blockchain service initialized successfully');

    // Activate Tri-Tier Bot System
    botOrchestrator.start();
    logger.info('Tri-Tier Bot System activated');
  } catch (error) {
    logger.error('Blockchain service initialization failed:', error);
    logger.error('This may be due to invalid PIMLICO_API_KEY, RPC URLs, or network connectivity');
    logger.error('Available environment variables:', Object.keys(process.env).filter(key =>
      key.includes('API') || key.includes('RPC') || key.includes('POOL') || key.includes('ROUTER')
    ));
    logger.warn('Blockchain features will be limited until API keys are configured');
    // Don't exit - allow partial functionality but log prominently
  }
}
