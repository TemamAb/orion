/**
 * ORION PORT DISCOVERY SYSTEM
 * AI-powered port scanning and allocation for autonomous deployment
 * Frontend-compatible version - actual port discovery should be handled by backend
 */

export interface PortDiscoveryResult {
  port: number;
  status: 'AVAILABLE' | 'IN_USE' | 'ERROR';
  message?: string;
}

export interface PortRange {
  start: number;
  end: number;
  preferred?: number[];
}

/**
 * Check if a specific port is available (Frontend stub - actual check done by backend)
 */
export async function checkPortAvailability(port: number): Promise<PortDiscoveryResult> {
  // In frontend, we assume ports are available since we can't actually check
  // Real port discovery should be done by the backend API
  console.log(`[ORION PORT DISCOVERY] Frontend stub: Port ${port} assumed available`);
  return {
    port,
    status: 'AVAILABLE',
    message: `Port ${port} assumed available (frontend stub)`
  };
}

/**
 * Scan a range of ports and return available ones
 */
export async function scanPortRange(range: PortRange): Promise<PortDiscoveryResult[]> {
  const results: PortDiscoveryResult[] = [];
  const ports = [];

  // Add preferred ports first
  if (range.preferred) {
    ports.push(...range.preferred);
  }

  // Add range ports
  for (let port = range.start; port <= range.end; port++) {
    if (!ports.includes(port)) {
      ports.push(port);
    }
  }

  console.log(`[ORION PORT DISCOVERY] Scanning ${ports.length} ports in range ${range.start}-${range.end}...`);

  // Check ports in parallel with concurrency limit
  const concurrencyLimit = 50;
  for (let i = 0; i < ports.length; i += concurrencyLimit) {
    const batch = ports.slice(i, i + concurrencyLimit);
    const batchPromises = batch.map(port => checkPortAvailability(port));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Progress indicator
    const progress = Math.round(((i + batch.length) / ports.length) * 100);
    console.log(`[ORION PORT DISCOVERY] Scan progress: ${progress}%`);
  }

  return results;
}

/**
 * Find the best available port from a range
 */
export async function findOptimalPort(range: PortRange): Promise<number | null> {
  const results = await scanPortRange(range);

  // First try preferred ports
  if (range.preferred) {
    for (const preferredPort of range.preferred) {
      const result = results.find(r => r.port === preferredPort);
      if (result?.status === 'AVAILABLE') {
        console.log(`[ORION PORT DISCOVERY] ✅ Found preferred port: ${preferredPort}`);
        return preferredPort;
      }
    }
  }

  // Then try any available port in range
  const availablePorts = results
    .filter(r => r.status === 'AVAILABLE')
    .sort((a, b) => a.port - b.port);

  if (availablePorts.length > 0) {
    const selectedPort = availablePorts[0].port;
    console.log(`[ORION PORT DISCOVERY] ✅ Found available port: ${selectedPort}`);
    return selectedPort;
  }

  console.log(`[ORION PORT DISCOVERY] ❌ No available ports found in range ${range.start}-${range.end}`);
  return null;
}

/**
 * ORION Standard Port Configurations
 */
export const ORION_PORT_CONFIGS = {
  FRONTEND: {
    start: 3000,
    end: 3999,
    preferred: [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009]
  },
  BACKEND: {
    start: 5000,
    end: 5999,
    preferred: [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009]
  },
  MONITORING: {
    start: 9090,
    end: 9199,
    preferred: [9090, 9091, 9092]
  },
  DATABASE: {
    start: 27017,
    end: 27027,
    preferred: [27017, 27018, 27019]
  }
};

/**
 * Auto-discover and allocate ports for ORION deployment
 */
export async function autoDiscoverPorts(): Promise<{
  frontend: number | null;
  backend: number | null;
  monitoring: number | null;
  database: number | null;
}> {
  console.log(`[ORION PORT DISCOVERY] 🔍 AI initiating autonomous port discovery...`);

  const [frontendPort, backendPort, monitoringPort, databasePort] = await Promise.all([
    findOptimalPort(ORION_PORT_CONFIGS.FRONTEND),
    findOptimalPort(ORION_PORT_CONFIGS.BACKEND),
    findOptimalPort(ORION_PORT_CONFIGS.MONITORING),
    findOptimalPort(ORION_PORT_CONFIGS.DATABASE)
  ]);

  const results = {
    frontend: frontendPort,
    backend: backendPort,
    monitoring: monitoringPort,
    database: databasePort
  };

  console.log(`[ORION PORT DISCOVERY] 📊 Discovery Results:`);
  console.log(`  Frontend: ${results.frontend || '❌ NONE'}`);
  console.log(`  Backend: ${results.backend || '❌ NONE'}`);
  console.log(`  Monitoring: ${results.monitoring || '❌ NONE'}`);
  console.log(`  Database: ${results.database || '❌ NONE'}`);

  return results;
}

/**
 * Validate port allocation for deployment
 */
export function validatePortAllocation(ports: { [key: string]: number | null }): {
  valid: boolean;
  missing: string[];
  conflicts: string[];
} {
  const missing: string[] = [];
  const conflicts: string[] = [];
  const allocatedPorts = new Set<number>();

  Object.entries(ports).forEach(([service, port]) => {
    if (!port) {
      missing.push(service);
    } else if (allocatedPorts.has(port)) {
      conflicts.push(`${service} (port ${port} already allocated)`);
    } else {
      allocatedPorts.add(port);
    }
  });

  return {
    valid: missing.length === 0 && conflicts.length === 0,
    missing,
    conflicts
  };
}
