/**
 * Tooltip Styles Configuration
 * Mobile-first approach with consistent theming throughout the application
 */

export const tooltipStyles = {
  // Container for tooltip wrapper (supports both desktop hover and mobile tap)
  container: 'group/tooltip relative inline-flex items-center',

  // Tooltip trigger icon styling (info icon)
  icon: 'ml-1 cursor-pointer inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold transition-colors hover:bg-blue-500/30',

  // Tooltip content base styles (mobile-first approach)
  tooltip:
    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 ' +
    // Mobile: show by default on small screens
    'block sm:hidden ' +
    // Desktop: hide by default, show on hover and focus
    'sm:hidden sm:group-hover/tooltip:block sm:group-focus-within/tooltip:block ' +
    // Styling
    'whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg border border-gray-700/50 ' +
    // Animation
    'transition-all opacity-0 sm:opacity-0 sm:group-hover/tooltip:opacity-100 sm:group-focus-within/tooltip:opacity-100 ' +
    'pointer-events-none sm:pointer-events-auto',

  // Alternative tooltip for desktop-only (hides on mobile by default)
  tooltipDesktopOnly:
    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 ' +
    'hidden sm:hidden sm:group-hover/tooltip:block sm:group-focus-within/tooltip:block ' +
    'whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg border border-gray-700/50 ' +
    'transition-all opacity-0 sm:opacity-0 sm:group-hover/tooltip:opacity-100 sm:group-focus-within/tooltip:opacity-100',

  // Accessibility-friendly with opacity transition
  tooltipWithOpacity:
    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 ' +
    'whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg border border-gray-700/50 ' +
    'opacity-0 transition-opacity duration-200 group-hover/tooltip:opacity-100 group-active/tooltip:opacity-100 group-focus-within/tooltip:opacity-100',

  // Arrow indicator (optional pointer)
  arrow: 'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 w-2 h-2 bg-gray-900 border border-gray-700/50 rotate-45',
};

export default tooltipStyles;
