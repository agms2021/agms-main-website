/**
 * AG Multi Services — Client-side Telemetry & Error Reporting
 * Transmits runtime errors, failed commands, and unhandled exceptions
 * directly to the AGMS CRM Telemetry Hub.
 */

const getTelemetryUrl = () => {
  if (typeof window === 'undefined') return 'https://crm.agmultiservices.online/api/telemetry/errors';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api/telemetry/errors';
  }
  return 'https://crm.agmultiservices.online/api/telemetry/errors';
};

export interface TelemetryReportPayload {
  title: string;
  detected_issue: string;
  workflow?: string;
  severity?: 'Critical' | 'Error' | 'Warning' | 'Info';
  username?: string;
  failure_reason?: string;
  safe_data?: string;
  unsaved_data?: any;
  attempted_fix?: string;
  recommended_action?: string;
}

// Simple in-memory cache to prevent duplicate flood within 10 seconds
const recentErrors = new Set<string>();

export async function reportWebsiteError(payload: TelemetryReportPayload): Promise<boolean> {
  try {
    const errorKey = `${payload.title}::${payload.detected_issue}`;
    if (recentErrors.has(errorKey)) return false;
    recentErrors.add(errorKey);
    setTimeout(() => recentErrors.delete(errorKey), 10000);

    const fullPayload = {
      source: 'Website',
      severity: payload.severity || 'Error',
      title: payload.title || 'Website Error',
      workflow: payload.workflow || 'CitizenPortal',
      detected_issue: payload.detected_issue,
      failure_reason: payload.failure_reason || '',
      machine_id: typeof navigator !== 'undefined' ? `${navigator.userAgent.slice(0, 100)} (${window.innerWidth}x${window.innerHeight})` : 'Browser-Client',
      username: payload.username || '',
      safe_data: payload.safe_data || (typeof window !== 'undefined' ? window.location.href : ''),
      unsaved_data: payload.unsaved_data || '',
      attempted_fix: payload.attempted_fix || '',
      recommended_action: payload.recommended_action || 'Check client inputs or network state',
    };

    // Use sendBeacon if available, otherwise fetch with keepalive
    const url = getTelemetryUrl();
    const dataStr = JSON.stringify(fullPayload);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([dataStr], { type: 'application/json' });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return true;
    }

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: dataStr,
      keepalive: true,
      mode: 'cors',
    });

    return true;
  } catch (err) {
    // Fail completely silent — monitoring should NEVER crash the main website
    console.warn('[Telemetry] Suppressed error sending telemetry report:', err);
    return false;
  }
}

/**
 * Initializes global error listeners for the website.
 * Call this once at app entry (e.g. App.tsx or main.tsx).
 */
export function initWebsiteTelemetry() {
  if (typeof window === 'undefined') return;

  // Window runtime error handler
  window.addEventListener('error', (event) => {
    reportWebsiteError({
      title: `Uncaught UI Error: ${event.message || 'Unknown Script Error'}`,
      detected_issue: event.message || 'Window error caught',
      workflow: 'UIRuntime',
      severity: 'Error',
      failure_reason: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
      safe_data: window.location.href,
    });
  });

  // Unhandled Promise Rejection (async API or network errors)
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || (typeof reason === 'string' ? reason : 'Promise rejected without error message');
    reportWebsiteError({
      title: `Unhandled Async Rejection: ${msg.slice(0, 100)}`,
      detected_issue: msg,
      workflow: 'AsyncOperation',
      severity: 'Warning',
      failure_reason: reason?.stack || JSON.stringify(reason || {}),
      safe_data: window.location.href,
    });
  });

  console.log('[Telemetry] AGMS Website Telemetry Active');
}
