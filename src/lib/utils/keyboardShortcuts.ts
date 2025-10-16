export interface KeyboardShortcut {
 description: string;
 action: () => void;
 category?: string;
}

export interface KeyboardShortcuts {
 [key: string]: KeyboardShortcut;
}

export interface ShortcutDependencies {
 goto: (path: string) => Promise<void>;
 focusSearch?: () => void;
 toggleHelp?: () => void;
 closeModal?: () => void;
}

export const createShortcuts = (deps: ShortcutDependencies): KeyboardShortcuts => {
 return {
  'mod+k': {
   description: 'Open command palette',
   action: () => {
    if (deps.focusSearch) deps.focusSearch();
   },
   category: 'Navigation'
  },
  'mod+/': {
   description: 'Show keyboard shortcuts',
   action: () => {
    if (deps.toggleHelp) deps.toggleHelp();
   },
   category: 'Help'
  },
  '/': {
   description: 'Focus search',
   action: () => {
    if (deps.focusSearch) deps.focusSearch();
   },
   category: 'Navigation'
  },
  'g h': {
   description: 'Go to home',
   action: () => {
    deps.goto('/@me').catch(() => {});
   },
   category: 'Navigation'
  },
  'g d': {
   description: 'Go to dashboard',
   action: () => {
    deps.goto('/@me').catch(() => {});
   },
   category: 'Navigation'
  },
  'g r': {
   description: 'Go to reminders',
   action: () => {
    deps.goto('/@me/reminders').catch(() => {});
   },
   category: 'Navigation'
  },
  'g s': {
   description: 'Go to settings',
   action: () => {
    deps.goto('/@me/bot').catch(() => {});
   },
   category: 'Navigation'
  },
  'g u': {
   description: 'Go to short URLs',
   action: () => {
    deps.goto('/@me/short-urls').catch(() => {});
   },
   category: 'Navigation'
  },
  '?': {
   description: 'Show help',
   action: () => {
    if (deps.toggleHelp) deps.toggleHelp();
   },
   category: 'Help'
  },
  Escape: {
   description: 'Close modal or dialog',
   action: () => {
    if (deps.closeModal) deps.closeModal();
   },
   category: 'General'
  }
 };
};

export const shortcuts: KeyboardShortcuts = {
 'mod+k': {
  description: 'Open command palette',
  action: () => {},
  category: 'Navigation'
 },
 'mod+/': {
  description: 'Show keyboard shortcuts',
  action: () => {},
  category: 'Help'
 },
 '/': {
  description: 'Focus search',
  action: () => {},
  category: 'Navigation'
 },
 'g h': {
  description: 'Go to home',
  action: () => {},
  category: 'Navigation'
 },
 'g d': {
  description: 'Go to dashboard',
  action: () => {},
  category: 'Navigation'
 },
 'g r': {
  description: 'Go to reminders',
  action: () => {},
  category: 'Navigation'
 },
 'g s': {
  description: 'Go to settings',
  action: () => {},
  category: 'Navigation'
 },
 'g u': {
  description: 'Go to short URLs',
  action: () => {},
  category: 'Navigation'
 },
 '?': {
  description: 'Show help',
  action: () => {},
  category: 'Help'
 },
 Escape: {
  description: 'Close modal or dialog',
  action: () => {},
  category: 'General'
 }
};

const normalizeKey = (event: KeyboardEvent): string => {
 const parts: string[] = [];

 if (event.ctrlKey || event.metaKey) parts.push('mod');
 if (event.altKey) parts.push('alt');
 if (event.shiftKey && event.key.length > 1) parts.push('shift');

 const key = event.key.toLowerCase();
 if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
  parts.push(key);
 }

 return parts.join('+');
};

export const createKeyboardHandler = () => {
 let sequenceBuffer = '';
 let sequenceTimeout: ReturnType<typeof setTimeout> | null = null;

 return (event: KeyboardEvent, shortcuts: KeyboardShortcuts): boolean => {
  const target = event.target as HTMLElement;
  const isInputField =
   target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

  if (isInputField && event.key !== 'Escape' && !event.ctrlKey && !event.metaKey) {
   return false;
  }

  const key = normalizeKey(event);

  if (sequenceTimeout) clearTimeout(sequenceTimeout);

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !isInputField) {
   sequenceBuffer += event.key.toLowerCase();

   sequenceTimeout = setTimeout(() => {
    sequenceBuffer = '';
   }, 1000);

   if (shortcuts[sequenceBuffer]) {
    event.preventDefault();
    shortcuts[sequenceBuffer].action();
    sequenceBuffer = '';
    return true;
   }
  } else {
   sequenceBuffer = '';

   if (shortcuts[key]) {
    event.preventDefault();
    shortcuts[key].action();
    return true;
   }
  }

  return false;
 };
};

export const handleKeyboardShortcut = createKeyboardHandler();

export const formatShortcut = (shortcut: string): string => {
 return shortcut
  .split('+')
  .map((part) => {
   if (part === 'mod') {
    return navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';
   }
   if (part === 'alt') return navigator.platform.toLowerCase().includes('mac') ? '⌥' : 'Alt';
   if (part === 'shift') return '⇧';
   return part.toUpperCase();
  })
  .join('+');
};

export const groupShortcutsByCategory = (
 shortcuts: KeyboardShortcuts
): Record<string, Array<{ key: string; shortcut: KeyboardShortcut }>> => {
 const grouped: Record<string, Array<{ key: string; shortcut: KeyboardShortcut }>> = {};

 Object.entries(shortcuts).forEach(([key, shortcut]) => {
  const category = shortcut.category || 'General';
  if (!grouped[category]) grouped[category] = [];
  grouped[category].push({ key, shortcut });
 });

 return grouped;
};
