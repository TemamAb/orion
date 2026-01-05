# Orion Enterprise Engine: Deployment & Operations Guide

## 1. System Architecture Overview
The Orion Engine has been upgraded to a **Forensic MEV Operating System**. It no longer relies on simulations; it actively forges profit strategies based on real-time Ethereum network conditions.

### **Core Modules:**
*   **The Profit Forge (Backend)**: A weighted algorithm (`server.js`) that analyzes Gas, Volatility, and Block Times to dynamically activate one of the 7 Strategy Nodes.
*   **Sentinel Engine (Blockchain)**: A resilient connectivity layer (`blockchain.js`) that operates in "Active Mode" (with Private Key) or "Monitoring Mode" (Read-Only) to ensure 100% uptime without server-side risk.
*   **Forensic Intelligence (AI)**: A grounded analysis layer (`aiService.js`) using `Gemini 1.5 Pro` to physically audit wallet transaction histories against strict MEV definitions (Flashbots, JIT, Sandwiching).

---

## 2. Environment Configuration
To unlock the full potential of the engine on Render, configure the following Environment Variables.

### **Critical Keys**
| Variable | Description | Requirement |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Powers the Forensic AI analysis. | **REQUIRED** |
| `ETH_RPC_URL` | High-speed connection to Ethereum (Infura/Alchemy). | **REQUIRED** (or defaults to public) |
| `PRIVATE_KEY` | Your execution wallet private key. | *Optional* (Required for Auto-Trade only) |

### **Security Note: Sentinel Mode**
*   **If `PRIVATE_KEY` is OMITTED**: The engine enters **Sentinel Mode**. It will fully visualize strategies, calculate yields, and monitor the network, but it **will not** sign transactions. This is the recommended configuration for the public dashboard deployment on Render.
*   **If `PRIVATE_KEY` is PROVIDED**: The engine enters **Active Execution Mode**. It can sign and broadcast Flash Loans. **Use with caution** and only in secure, private deployments.

---

## 3. The 7-Strategy Matrix (Live Status)
Your dashboard now reflects live network states. Here is how to interpret the status codes:

1.  **THE GHOST** (Private Order Flow)
    *   **Trigger**: High Gas (>40 gwei) + High Volatility.
    *   **Meaning**: Mainnet is congested; private Flashbots bundles are the only way to trade profitably.
2.  **SLOT-0 SNIPER** (Latency)
    *   **Trigger**: Low Volatility + Stable Block Times.
    *   **Meaning**: Conditions are perfect for top-of-block racing.
3.  **BUNDLE MASTER** (Sandwich)
    *   **Trigger**: Moderate Gas (15-50 gwei).
    *   **Meaning**: Normal market conditions allowing for Atomic atomic bundling.
4.  **ATOMIC FLUX** (Arbitrage)
    *   **Trigger**: High Volatility (>0.6 index).
    *   **Meaning**: Price dislocations are occurring between DEXs.
5.  **DARK RELAY** (JIT Liquidity)
    *   **Trigger**: Specific Block Modulos (Rare events).
    *   **Meaning**: Detecting deep liquidity shifts suitable for Just-In-Time provisioning.
6.  **HIVE SYMMETRY** (Copy Trading)
    *   **Trigger**: Always Active (Baseline).
    *   **Meaning**: Monitoring alpha wallets for mirror signals.
7.  **DISCOVERY HUNT** (Mempool Scanning)
    *   **Trigger**: Low Gas (<20 gwei).
    *   **Meaning**: Cheap gas allows for aggressive scanning of new contract deployments.

---

## 4. Verification Checklist
1.  **Deploy**: Push to Render.
2.  **Login**: Access the Dashboard.
3.  **Status Check**: Verify footer says `SERVER: ONLINE`.
4.  **Activate**: Click `START ENGINE`.
    *   *Verification*: The "Strategy Matrix" rings should animate based on *actual* gas prices. If ETH gas is high, "The Ghost" should go ACTIVE.
5.  **AI Audit**: Go to "System Intel" and input a wallet address.
    *   *Verification*: Result should classify it using one of the 7 specific categories (e.g., "CLASSIFICATION: SLOT_0_SNIPER").

---

**© 2025 Orion_Alpha | Enterprise Grade Flash Loan Engine**
