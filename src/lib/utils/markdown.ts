import { marked } from 'marked';

// Configure marked for safe rendering with custom renderer
const renderer = new marked.Renderer();

// Customize link rendering to open in new tab and have distinct styling
renderer.link = (token) => {
 const href = token.href || '';
 const title = token.title ? ` title="${token.title}"` : '';
 const text = token.text || href;
 return `<a href="${href}"${title} target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline decoration-primary/60 underline-offset-2 font-medium transition-colors">${text}</a>`;
};

marked.setOptions({
 breaks: true, // Convert \n to <br>
 gfm: true, // GitHub Flavored Markdown
 renderer: renderer,
 sanitizer: (html) => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  // But preserve ordered lists and list items
  return html
   .replace(/<script[^>]*>.*?<\/script>/gi, '')
   .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
   .replace(/on\w+="[^"]*"/gi, '')
   .replace(/javascript:/gi, '');
 }
});

export const renderMarkdown = (text: string): string => {
 if (!text) return '';

 try {
  let processed = text;

  // Custom syntax: -# makes text smaller
  // Matches: -# text content
  // Replaces with: <small>text content</small>
  processed = processed.replace(
   /-#\s+(.+?)(?=\n|$)/g,
   '<small class="text-xs opacity-75">$1</small>'
  );

  return marked(processed) as string;
 } catch (error) {
  console.warn('Markdown rendering error:', error);
  return text; // Fallback to plain text
 }
};

export const stripMarkdown = (text: string): string => {
 if (!text) return '';

 return text
  .replace(/#{1,6}\s?/g, '') // Remove headers
  .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
  .replace(/\*(.*?)\*/g, '$1') // Remove italic
  .replace(/`(.*?)`/g, '$1') // Remove inline code
  .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
  .replace(/>\s?/g, '') // Remove blockquotes
  .replace(/^\s*[\*\-\+]\s/gm, '') // Remove list markers
  .replace(/^\s*\d+\.\s/gm, '') // Remove numbered list markers
  .replace(/-#\s+/g, '') // Remove custom small text marker
  .trim();
};
