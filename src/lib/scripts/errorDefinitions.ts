const FALLBACK_CODE = 500;

export type ErrorDefinition = {
 code: number;
 icon: string;
 title: string;
 description: string;
 color: string;
 bgGradient: string;
 suggestions: string[];
};

export const ERROR_DEFINITIONS: ReadonlyArray<ErrorDefinition> = [
 {
  code: 400,
  icon: 'i-tabler-exclamation-circle',
  title: 'Bad Request',
  description: 'The request could not be understood by the server.',
  color: 'text-orange-400',
  bgGradient: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
  suggestions: ['Check the URL for typos', 'Clear your browser cache', 'Try refreshing the page']
 },
 {
  code: 401,
  icon: 'i-tabler-lock',
  title: 'Authentication Required',
  description: 'You need to sign in to access this page.',
  color: 'text-blue-400',
  bgGradient: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
  suggestions: [
   'Sign in with your Discord account',
   'Check if your session has expired',
   'Ensure cookies are enabled'
  ]
 },
 {
  code: 403,
  icon: 'i-tabler-shield-x',
  title: 'Access Denied',
  description: 'You do not have permission to access this resource.',
  color: 'text-red-400',
  bgGradient: 'from-red-500/20 via-rose-500/20 to-pink-500/20',
  suggestions: [
   'Contact a server administrator',
   'Verify you have the correct permissions',
   'Try accessing a different server'
  ]
 },
 {
  code: 404,
  icon: 'i-tabler-ghost-2',
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
  color: 'text-purple-400',
  bgGradient: 'from-purple-500/20 via-violet-500/20 to-indigo-500/20',
  suggestions: ['Check the URL for typos', 'Return to the homepage', 'Use the navigation menu']
 },
 {
  code: 429,
  icon: 'i-tabler-clock-pause',
  title: 'Too Many Requests',
  description: 'Slow down! You are making too many requests.',
  color: 'text-yellow-400',
  bgGradient: 'from-yellow-500/20 via-orange-500/20 to-red-500/20',
  suggestions: [
   'Wait a few moments before trying again',
   'Reduce the frequency of your requests',
   'Check if you are running any automated scripts'
  ]
 },
 {
  code: 500,
  icon: 'i-tabler-server-off',
  title: 'Server Error',
  description: 'Something went wrong on our end. We are working on it!',
  color: 'text-red-500',
  bgGradient: 'from-red-500/20 via-orange-500/20 to-yellow-500/20',
  suggestions: [
   'Try refreshing the page',
   'Come back in a few minutes',
   'Report this issue if it persists'
  ]
 },
 {
  code: 503,
  icon: 'i-tabler-tool',
  title: 'Service Unavailable',
  description: 'We are currently performing maintenance.',
  color: 'text-amber-400',
  bgGradient: 'from-amber-500/20 via-yellow-500/20 to-orange-500/20',
  suggestions: ['Check our status page', 'Follow us for updates', 'Try again in a few minutes']
 }
];

const fallback =
 ERROR_DEFINITIONS.find((item) => item.code === FALLBACK_CODE) ?? ERROR_DEFINITIONS[0];

export const getErrorDefinition = (status: number): ErrorDefinition => {
 return ERROR_DEFINITIONS.find((item) => item.code === status) ?? fallback;
};
