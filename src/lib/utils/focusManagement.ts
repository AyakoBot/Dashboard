export const saveFocus = (): HTMLElement | null => {
 return document.activeElement as HTMLElement | null;
};

export const restoreFocus = (element: HTMLElement | null) => {
 if (element && typeof element.focus === 'function') {
  element.focus();
 }
};

export const focusFirstFocusable = (container: HTMLElement) => {
 const focusable = container.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
 );
 if (focusable.length > 0) {
  (focusable[0] as HTMLElement).focus();
 }
};

export const trapFocus = (container: HTMLElement) => {
 const focusableElements = container.querySelectorAll<HTMLElement>(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
 );
 const firstElement = focusableElements[0];
 const lastElement = focusableElements[focusableElements.length - 1];

 return (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;

  if (event.shiftKey) {
   if (document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
   }
  } else {
   if (document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
   }
  }
 };
};
