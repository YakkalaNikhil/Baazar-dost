/**
 * Utility functions for handling popup windows and detection
 */

export const detectPopupBlocker = () => {
  try {
    // Try to open a popup window
    const popup = window.open('', '_blank', 'width=1,height=1,left=0,top=0,scrollbars=no,resizable=no');
    
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      return true; // Popup blocked
    }
    
    // Close the test popup
    popup.close();
    return false; // Popup allowed
  } catch (error) {
    return true; // Popup blocked
  }
};

export const isPopupBlocked = () => {
  return detectPopupBlocker();
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const shouldUseRedirect = () => {
  // Use redirect on mobile devices or when popups are blocked
  return isMobileDevice() || isPopupBlocked();
};

export const getRecommendedAuthMethod = () => {
  if (shouldUseRedirect()) {
    return {
      method: 'redirect',
      reason: isMobileDevice() ? 'Mobile device detected' : 'Popup blocker detected'
    };
  }
  
  return {
    method: 'popup',
    reason: 'Desktop with popups enabled'
  };
};

export const showPopupInstructions = () => {
  const instructions = [
    '1. Look for a popup blocker icon in your browser address bar',
    '2. Click on it and select "Always allow popups from this site"',
    '3. Refresh the page and try again',
    '4. Or use the "Redirect" option instead'
  ];
  
  return instructions;
};

export const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Unknown';
};

export const getPopupBlockerHelp = () => {
  const browser = getBrowserName();
  
  const helpText = {
    Chrome: 'Click the popup blocked icon in the address bar and select "Always allow"',
    Firefox: 'Click the shield icon in the address bar and disable popup blocking',
    Safari: 'Go to Safari > Preferences > Websites > Pop-up Windows and allow for this site',
    Edge: 'Click the popup blocked notification and select "Always allow"',
    Opera: 'Click the popup blocked icon in the address bar and allow popups',
    Unknown: 'Check your browser settings to allow popups for this site'
  };
  
  return helpText[browser] || helpText.Unknown;
};
