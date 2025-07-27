// Utility functions for safe date handling with Firestore timestamps

/**
 * Safely converts a Firestore timestamp or date to a JavaScript Date object
 * @param {any} dateValue - Could be a Firestore Timestamp, Date, string, or null
 * @returns {Date} - A valid Date object or current date as fallback
 */
export const safeToDate = (dateValue) => {
  if (!dateValue) {
    return new Date()
  }

  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue
  }

  // If it's a Firestore Timestamp with toDate method
  if (dateValue && typeof dateValue.toDate === 'function') {
    try {
      return dateValue.toDate()
    } catch (error) {
      console.warn('Error converting Firestore timestamp:', error)
      return new Date()
    }
  }

  // If it's a string or number, try to parse it
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  }

  // If it's an object with seconds (Firestore timestamp format)
  if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
    try {
      return new Date(dateValue.seconds * 1000)
    } catch (error) {
      console.warn('Error converting timestamp object:', error)
      return new Date()
    }
  }

  // Fallback to current date
  console.warn('Unable to parse date value:', dateValue)
  return new Date()
}

/**
 * Safely formats a date for display
 * @param {any} dateValue - Date value to format
 * @param {string} format - Format type: 'date', 'time', 'datetime'
 * @param {string} locale - Locale for formatting (default: 'en-IN')
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateValue, format = 'date', locale = 'en-IN') => {
  const date = safeToDate(dateValue)
  
  try {
    switch (format) {
      case 'date':
        return date.toLocaleDateString(locale)
      case 'time':
        return date.toLocaleTimeString(locale)
      case 'datetime':
        return date.toLocaleString(locale)
      case 'relative':
        return getRelativeTime(date)
      default:
        return date.toLocaleDateString(locale)
    }
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Invalid Date'
  }
}

/**
 * Gets relative time string (e.g., "2 hours ago", "yesterday")
 * @param {Date} date - Date to get relative time for
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * Safely processes Firestore document data with date conversion
 * @param {Object} docData - Firestore document data
 * @param {string[]} dateFields - Array of field names that contain dates
 * @returns {Object} - Processed document data with converted dates
 */
export const processFirestoreDoc = (docData, dateFields = ['createdAt', 'updatedAt']) => {
  const processed = { ...docData }
  
  dateFields.forEach(field => {
    if (processed[field]) {
      processed[field] = safeToDate(processed[field])
    }
  })
  
  return processed
}

/**
 * Formats order date for display in different contexts
 * @param {any} dateValue - Order date value
 * @param {string} context - Display context: 'list', 'detail', 'card'
 * @returns {string} - Formatted date string
 */
export const formatOrderDate = (dateValue, context = 'list') => {
  const date = safeToDate(dateValue)
  
  switch (context) {
    case 'list':
      return formatDate(date, 'date')
    case 'detail':
      return formatDate(date, 'datetime')
    case 'card':
      return getRelativeTime(date)
    default:
      return formatDate(date, 'date')
  }
}

/**
 * Checks if a date is today
 * @param {any} dateValue - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (dateValue) => {
  const date = safeToDate(dateValue)
  const today = new Date()
  
  return date.toDateString() === today.toDateString()
}

/**
 * Checks if a date is within the last N days
 * @param {any} dateValue - Date to check
 * @param {number} days - Number of days to check
 * @returns {boolean} - True if date is within the last N days
 */
export const isWithinDays = (dateValue, days) => {
  const date = safeToDate(dateValue)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  
  return diffDays <= days
}
