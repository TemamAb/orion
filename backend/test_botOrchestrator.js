const BotOrchestrator = require('./botOrchestrator');

// Test script for BotOrchestrator
async function testBotOrchestrator() {
  console.log('Testing BotOrchestrator...');

  // Test starting the system
  console.log('Starting Tri-Tier Bot System...');
  BotOrchestrator.start();
  console.log('System status:', BotOrchestrator.getSystemStatus());

  // Wait a bit for the loop to run
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Check status after some cycles
  console.log('Status after 5 seconds:', BotOrchestrator.getSystemStatus());

  // Test stopping the system
  console.log('Stopping Tri-Tier Bot System...');
  BotOrchestrator.stop();
  console.log('Final status:', BotOrchestrator.getSystemStatus());

  console.log('Tests completed.');
}

testBotOrchestrator().catch(console.error);
