
import 'dotenv/config';

export const config = {
  port: process.env.PORT || '8080',
  gcpProjectId: process.env.GCP_PROJECT_ID,
  pimlicoApiKeySecretName: process.env.PIMLICO_API_KEY_SECRET_NAME || 'PIMLICO_API_KEY',
  walletPrivateKeySecretName: process.env.WALLET_PRIVATE_KEY_SECRET_NAME || 'EXECUTOR_WALLET_KEY',
  flashbotsRpcUrl: process.env.FLASHBOTS_RPC_URL || 'https://rpc.flashbots.net',
};

if (!config.gcpProjectId) {
  throw new Error('GCP_PROJECT_ID environment variable not set');
}
