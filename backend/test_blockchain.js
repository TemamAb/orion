const BlockchainService = require('./blockchain');

// Test script for BlockchainService
async function testBlockchainService() {
  console.log('Testing BlockchainService...');

  // Test initialization for ETH
  console.log('Initializing for ETH...');
  await BlockchainService.initialize('ETH');
  console.log('Current chain:', BlockchainService.currentChain);

  // Test selectBestFlashLoanProvider
  console.log('Testing selectBestFlashLoanProvider for ETH...');
  const providerETH = BlockchainService.selectBestFlashLoanProvider('0xA0b86a33E6441e88C5F2712C3E9b74Ae1f0f2c4d', 1000, 'ETH');
  console.log('Selected provider for ETH:', providerETH.name, 'Chain:', providerETH.chain);

  // Test initialization for BASE
  console.log('Initializing for BASE...');
  await BlockchainService.initialize('BASE');
  console.log('Current chain:', BlockchainService.currentChain);

  // Test selectBestFlashLoanProvider for BASE
  console.log('Testing selectBestFlashLoanProvider for BASE...');
  const providerBASE = BlockchainService.selectBestFlashLoanProvider('0xA0b86a33E6441e88C5F2712C3E9b74Ae1f0f2c4d', 1000, 'BASE');
  console.log('Selected provider for BASE:', providerBASE.name, 'Chain:', providerBASE.chain);

  // Test executeFlashLoanArbitrage (mock, since no signer)
  console.log('Testing executeFlashLoanArbitrage (should fail due to no signer)...');
  const result = await BlockchainService.executeFlashLoanArbitrage({
    tokenIn: '0xA0b86a33E6441e88C5F2712C3E9b74Ae1f0f2c4d',
    tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    amount: 1000,
    dexPath: ['Uniswap']
  });
  console.log('Result:', result);

  console.log('Tests completed.');
}

testBlockchainService().catch(console.error);
