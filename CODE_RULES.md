# Code Rules

## Basic Style

- Keep lines under 100 characters
- Use single quotes `'` for strings
- Use backticks `` ` `` for template strings (never join strings with `+`)

```typescript
// ✅ Do this
const message = `Hello ${name}, welcome!`;

// ❌ Not this
const message = 'Hello ' + name + ', welcome!';
```

- Always use `===` and `!==` (never `==` or `!=`)
- Use `const` by default, `let` only when you need to change the value
- Never use `var`
- Prefer single-line objects when they fit under 100 characters

```typescript
// ✅ Short objects on one line
const user = prisma.user.findMany({ where: { active: true } });

// ✅ Long objects need multiple lines
const user = prisma.user.findMany({
 where: {
  active: true,
  name: 'someVeryLongNameThatExceedsTheLineLimit',
 },
});

// ❌ Don't split short objects unnecessarily
const user = prisma.user.findMany({
 where: {
  active: true,
 },
});
```

## Naming

- Variables and functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_CASE`
- Files: `camelCase` (except class files use `PascalCase`)
- Indent with 1 space only

## Functions

- Use arrow functions: `const myFunc = () => {}`
- Use `async/await` instead of `.then()`
- Use `.catch()` instead of try/catch for errors
- Use destructuring: `const { name, age } = user`
- Use `map()` when returning values, `forEach()` for side effects but prefer for..of and for..in
- Keep functions shallow - max 1 level of indentation
- Skip `{}` braces for simple return functions
- Use ternary `?:` for simple checks

```typescript
// ✅ Good - shallow and clear
const processUsers = (users: User[]): ValidUser[] =>
 users.map((user) => validateAndTransformUser(user));

const validateAndTransformUser = (user: User): ValidUser | null =>
 user.isValid ? transformUser(user) : null;

// ❌ Bad - too nested
const processUsers = (users: User[]) => {
 return users.map((user) => {
  if (user.isValid) {
   return { ...user, processed: true };
  }
  return null;
 });
};
```

## If Statements

Only use `{}` braces when:

- Multiple lines
- Single line is too long (over 100 chars)
- Favour early returns

```typescript
// ✅ Short and simple
if (user.isActive) return user.data;

// ✅ Long line needs braces
if (user.isActive) {
 return user.data.someVeryLongPropertyNameThatExceedsTheLineLimit;
}

// ✅ Multiple actions need braces
if (user.isActive) {
 user.lastAccessed = new Date();
 return user.data;
}
```

## Switch Statements

- Always include `default` case
- For simple returns: no `{}`, put return on next line
- For complex cases: use `{` `}` braces
- Always `break` unless returning
- Add empty line after each case

```typescript
const getStatusMessage = (status: string): string => {
 switch (status) {
  case 'active':
   return 'User is active';

  case 'inactive': {
   const message = 'User is inactive';
   logInactiveUser();
   return message;
  }

  case 'pending': {
   notifyAdmin();
   break;
  }

  default:
   return 'Unknown status';
 }
};
```

## Classes

- Use singletons for shared state/caches
- All methods must return values (no side effects)
- Use `static` methods when not using `this`
- Singleton pattern needs `getInstance()` method
- Private methods start with `_`
- All functions must be pure (no side effects anywhere)

```typescript
class CacheManager {
 private static instance: CacheManager;
 private cache = new Map<string, string>();

 private constructor() {}

 static getInstance(): CacheManager {
  if (!CacheManager.instance) CacheManager.instance = new CacheManager();
  return CacheManager.instance;
 }

 get(key: string): string | null {
  return this.cache.get(key) ?? null;
 }
}
```

## Values & Types

- Use `null` for empty (not `undefined`)
- Never use `any` (except in tests)
- Type everything
- Forced typecasts (`as unknown as`) should be avoided if possible
- Import types properly:

```typescript
// ✅ Correct type imports
import type { User } from './types/user.js';
import { type Product, calculatePrice } from './product.js';

// ❌ Wrong
import { User } from './types/user.js';
```

## Files & Imports

- Use ESM modules only
- All imports need `.js` extension
- Use relative paths (`./` or `../`) or aliases (`$api`) if defined, do not define new aliases
- Sort imports with VSCode (Shift-Alt-O)

## Comments

- Use `//` for single lines, `/* */` for multiple lines
- Add JSDoc above functions and classes
- Only comment when code isn't clear enough

## Testing

- Test everything in `__tests__` folder
- Use Jest with ts-jest

## Accessibility (A11y) - MANDATORY

All UI components must comply with **WCAG 2.1 AA standards**. Accessibility is not optional.

### Semantic HTML

- Always use proper semantic elements (never `div` or `span` for interactive elements)
- Use `<button>` for actions, `<a>` for navigation
- Maintain logical heading hierarchy (`h1` → `h2` → `h3`, no skipping)
- Use semantic landmarks (`<nav>`, `<main>`, `<section>`, `<article>`)

```svelte
<!-- ✅ Semantic and accessible -->
<button type="button" on:click={handleSubmit}>
 Submit Form
</button>

<nav aria-label="Main navigation">
 <a href="/dashboard">Dashboard</a>
</nav>

<!-- ❌ Not semantic -->
<div class="button" on:click={handleSubmit}>
 Submit Form
</div>
```

### ARIA Attributes

- Use `aria-label` when visible text isn't descriptive enough
- Connect help text with `aria-describedby`
- Use state attributes: `aria-expanded`, `aria-selected`, `aria-checked`
- Implement `aria-live` regions for dynamic updates
- Use `aria-hidden="true"` for decorative elements only

```svelte
<!-- ✅ Proper ARIA usage -->
<button 
 aria-label="Close notification" 
 aria-expanded={isOpen}
 on:click={closeNotification}
>
 ×
</button>

<input 
 type="email"
 aria-describedby="email-help"
 aria-invalid={emailError ? 'true' : 'false'}
/>
<div id="email-help">Enter your work email address</div>

<!-- ✅ Live regions for dynamic content -->
<div aria-live="polite" aria-atomic="true">
 {#if statusMessage}
  {statusMessage}
 {/if}
</div>
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Provide visible focus indicators (3:1 contrast ratio minimum)
- Support standard keyboard patterns (Enter, Space, Arrow keys, Escape)
- Implement skip links for main content navigation
- Manage focus in modals and dynamic content

```typescript
// ✅ Keyboard event handling
const handleKeyDown = (event: KeyboardEvent): void => {
 if (event.key === 'Enter' || event.key === ' ') {
  event.preventDefault();
  handleAction();
 }
 if (event.key === 'Escape') closeModal();
};

// ✅ Focus management
const trapFocusInModal = (modalElement: HTMLElement): void => {
 const focusableElements = modalElement.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
 );
 const firstElement = focusableElements[0] as HTMLElement;
 const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
 
 firstElement?.focus();
};
```

### Visual Accessibility

- Maintain 4.5:1 contrast ratio for normal text (18px and smaller)
- Maintain 3:1 contrast ratio for large text (19px+ or 14px+ bold)
- Focus indicators must have 3:1 contrast against adjacent colors
- Never rely solely on color to convey information
- Support 200% zoom without horizontal scrolling
- Minimum touch target size: 44×44px

```css
/* ✅ Proper contrast and focus indicators */
.button {
 background: #1976d2; /* 4.51:1 contrast on white */
 color: white;
 min-height: 44px;
 min-width: 44px;
}

.button:focus {
 outline: 3px solid #ffeb3b; /* 3.2:1 contrast against blue */
 outline-offset: 2px;
}

/* ✅ Don't rely on color alone */
.status--error {
 color: #d32f2f;
 border-left: 4px solid currentColor;
}
.status--error::before {
 content: '⚠️ ';
 font-weight: bold;
}
```

### Form Accessibility

- All inputs must have associated labels (use `<label>` or `aria-labelledby`)
- Group related fields with `<fieldset>` and `<legend>`
- Provide clear error messages associated with fields
- Use `aria-required` for required fields
- Implement proper validation feedback

```svelte
<!-- ✅ Accessible form structure -->
<fieldset>
 <legend>User Information</legend>
 
 <label for="username">Username (required)</label>
 <input 
  id="username"
  type="text"
  bind:value={username}
  aria-required="true"
  aria-invalid={usernameError ? 'true' : 'false'}
  aria-describedby="username-error"
 />
 {#if usernameError}
  <div id="username-error" role="alert">
   {usernameError}
  </div>
 {/if}
</fieldset>
```

### Content Accessibility

- All images need meaningful `alt` text or `alt=""` if decorative
- Use `alt=""` for icons that are purely decorative
- Link text must be descriptive (avoid "click here", "read more")
- Use clear, simple language appropriate for wide audiences
- Provide text alternatives for audio/video content

```svelte
<!-- ✅ Meaningful alt text -->
<img src="user-profile.jpg" alt="John Smith's profile picture" />

<!-- ✅ Decorative images -->
<img src="decoration.svg" alt="" aria-hidden="true" />

<!-- ✅ Descriptive link text -->
<a href="/user/profile">View John Smith's profile</a>

<!-- ❌ Non-descriptive links -->
<a href="/user/profile">Click here</a>
```

### Dynamic Content

- Use `aria-live` regions for status updates and notifications
- Announce loading states to screen readers
- Manage focus when content changes dynamically
- Provide accessible error handling and recovery

```svelte
<!-- ✅ Accessible dynamic content -->
<div aria-live="polite" aria-label="Form status">
 {#if isLoading}
  Loading user data...
 {:else if error}
  Error: {error.message}
 {:else if success}
  User data saved successfully
 {/if}
</div>

<!-- ✅ Loading states -->
<button disabled={isLoading} aria-describedby="loading-status">
 {#if isLoading}
  <span aria-hidden="true">⏳</span>
  Saving...
 {:else}
  Save Changes
 {/if}
</button>
```

### Testing Requirements

- Test all components with keyboard-only navigation
- Verify screen reader compatibility using browser dev tools
- Check color contrast with tools like WebAIM's contrast checker
- Validate HTML semantics and ARIA implementation
- Test with browser zoom at 200%
- Use axe-core or similar accessibility testing tools

```typescript
// ✅ Include in component tests
test('button is keyboard accessible', async () => {
 render(Button, { props: { onClick: mockFn } });
 const button = screen.getByRole('button');
 
 await user.tab();
 expect(button).toHaveFocus();
 
 await user.keyboard('{Enter}');
 expect(mockFn).toHaveBeenCalled();
});
```

## Tools

- Follow ESLint + Airbnb rules
- Use Prettier for formatting
- Keep README.md updated
