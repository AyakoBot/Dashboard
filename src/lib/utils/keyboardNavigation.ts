export interface KeyboardShortcut {
 key: string;
 ctrl?: boolean;
 meta?: boolean;
 shift?: boolean;
 alt?: boolean;
 description: string;
 action: () => void;
}

const shortcuts = new Map<string, KeyboardShortcut>();

const getShortcutKey = (shortcut: Omit<KeyboardShortcut, 'description' | 'action'>): string => {
 const parts = [];
 if (shortcut.ctrl) parts.push('ctrl');
 if (shortcut.meta) parts.push('meta');
 if (shortcut.shift) parts.push('shift');
 if (shortcut.alt) parts.push('alt');
 parts.push(shortcut.key.toLowerCase());
 return parts.join('+');
};

export const registerShortcut = (shortcut: KeyboardShortcut): void => {
 const key = getShortcutKey(shortcut);
 shortcuts.set(key, shortcut);
};

export const unregisterShortcut = (
 shortcut: Omit<KeyboardShortcut, 'description' | 'action'>,
): void => {
 const key = getShortcutKey(shortcut);
 shortcuts.delete(key);
};

export const handleKeyboardEvent = (event: KeyboardEvent): boolean => {
 const target = event.target as HTMLElement;
 if (['INPUT', 'TEXTAREA'].includes(target.tagName) && !event.metaKey && !event.ctrlKey) {
 return false;
 }

 const parts = [];
 if (event.ctrlKey) parts.push('ctrl');
 if (event.metaKey) parts.push('meta');
 if (event.shiftKey) parts.push('shift');
 if (event.altKey) parts.push('alt');
 parts.push(event.key.toLowerCase());

 const key = parts.join('+');
 const shortcut = shortcuts.get(key);

 if (shortcut) {
 event.preventDefault();
 shortcut.action();
 return true;
 }

 return false;
};

export const createFocusTrap = (container: HTMLElement) => {
 const focusableElements = container.querySelectorAll<HTMLElement>(
 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
 );

 const firstElement = focusableElements[0];
 const lastElement = focusableElements[focusableElements.length - 1];

 const handleTabKey = (e: KeyboardEvent) => {
 if (e.key !== 'Tab') return;

 if (e.shiftKey) {
  if (document.activeElement === firstElement) {
  lastElement?.focus();
  e.preventDefault();
  }
 } else {
  if (document.activeElement === lastElement) {
  firstElement?.focus();
  e.preventDefault();
  }
 }
 };

 container.addEventListener('keydown', handleTabKey);

 firstElement?.focus();

 return () => {
 container.removeEventListener('keydown', handleTabKey);
 };
};

export const navigateWithKeyboard = (
 direction: 'up' | 'down' | 'left' | 'right',
 items: HTMLElement[],
): void => {
 const currentIndex = items.findIndex((item) => item === document.activeElement);
 let nextIndex = currentIndex;

 switch (direction) {
 case 'up':
 case 'left':
  nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
  break;
 case 'down':
 case 'right':
  nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
  break;
 }

 items[nextIndex]?.focus();
};

let liveRegion: HTMLElement | null = null;

export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
 if (!liveRegion) {
 liveRegion = document.createElement('div');
 liveRegion.setAttribute('aria-live', priority);
 liveRegion.setAttribute('aria-atomic', 'true');
 liveRegion.style.position = 'absolute';
 liveRegion.style.left = '-10000px';
 liveRegion.style.width = '1px';
 liveRegion.style.height = '1px';
 liveRegion.style.overflow = 'hidden';
 document.body.appendChild(liveRegion);
 }

 liveRegion.textContent = message;

 setTimeout(() => {
 if (liveRegion) liveRegion.textContent = '';
 }, 1000);
};

export const initializeDefaultShortcuts = (): void => {
 registerShortcut({
 key: '/',
 description: 'Focus search',
 action: () => {
  const searchInput = document.querySelector<HTMLInputElement>(
  'input[type="search"], input[placeholder*="Search"]',
  );
  searchInput?.focus();
 },
 });

 registerShortcut({
 key: 'k',
 meta: true,
 description: 'Quick search',
 action: () => {
  const searchInput = document.getElementById('nav-search') as HTMLInputElement;
  searchInput?.focus();
 },
 });

 registerShortcut({
 key: 'b',
 meta: true,
 description: 'Toggle sidebar',
 action: () => {
  document.dispatchEvent(new CustomEvent('toggle-sidebar'));
 },
 });

 registerShortcut({
 key: '?',
 description: 'Show keyboard shortcuts',
 action: () => {
  document.dispatchEvent(new CustomEvent('show-shortcuts'));
 },
 });

 registerShortcut({
 key: 'Escape',
 description: 'Close modal/dialog',
 action: () => {
  document.dispatchEvent(new CustomEvent('close-modal'));
 },
 });

 registerShortcut({
 key: 'g',
 shift: true,
 description: 'Go to dashboard',
 action: () => {
  window.location.href = '/@me';
 },
 });

 registerShortcut({
 key: 'r',
 shift: true,
 description: 'Go to reminders',
 action: () => {
  window.location.href = '/@me/reminders';
 },
 });

 registerShortcut({
 key: 'u',
 shift: true,
 description: 'Go to URLs',
 action: () => {
  window.location.href = '/@me/short-urls';
 },
 });
};

export const addSkipLink = (): void => {
 const skipLink = document.createElement('a');
 skipLink.href = '#main-content';
 skipLink.className =
 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg';
 skipLink.textContent = 'Skip to main content';
 document.body.insertBefore(skipLink, document.body.firstChild);
};

export const setupRovingTabindex = (container: HTMLElement, selector: string): (() => void) => {
 const items = container.querySelectorAll<HTMLElement>(selector);
 let currentIndex = 0;

 items.forEach((item, index) => {
 item.setAttribute('tabindex', index === 0 ? '0' : '-1');
 });

 const handleKeyDown = (e: KeyboardEvent) => {
 const key = e.key;
 let newIndex = currentIndex;

 switch (key) {
  case 'ArrowDown':
  case 'ArrowRight':
  newIndex = (currentIndex + 1) % items.length;
  e.preventDefault();
  break;
  case 'ArrowUp':
  case 'ArrowLeft':
  newIndex = (currentIndex - 1 + items.length) % items.length;
  e.preventDefault();
  break;
  case 'Home':
  newIndex = 0;
  e.preventDefault();
  break;
  case 'End':
  newIndex = items.length - 1;
  e.preventDefault();
  break;
  default:
  return;
 }

 items[currentIndex].setAttribute('tabindex', '-1');
 items[newIndex].setAttribute('tabindex', '0');
 items[newIndex].focus();
 currentIndex = newIndex;
 };

 container.addEventListener('keydown', handleKeyDown);

 return () => {
 container.removeEventListener('keydown', handleKeyDown);
 };
};
