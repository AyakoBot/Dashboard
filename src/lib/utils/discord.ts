// Discord CDN utilities

/**
 * Constructs a proper Discord CDN URL for guild icons
 */
export const getGuildIconUrl = (guildId: string, iconHash: string | null | undefined): string | null => {
 if (!iconHash) return null;
 
 // If it's already a full URL, return it as is
 if (iconHash.startsWith('http')) {
  return iconHash;
 }
 
 // Check if it's an animated icon (starts with a_)
 const isAnimated = iconHash.startsWith('a_');
 const format = isAnimated ? 'gif' : 'webp';
 
 return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${format}`;
};

/**
 * Constructs a proper Discord CDN URL for user avatars
 */
export const getUserAvatarUrl = (userId: string, avatarHash: string | null | undefined): string | null => {
 if (!avatarHash) return null;
 
 // Check if it's an animated avatar (starts with a_)
 const isAnimated = avatarHash.startsWith('a_');
 const format = isAnimated ? 'gif' : 'webp';
 
 return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}`;
};

/**
 * Gets the default Discord avatar for a user based on their discriminator or ID
 */
export const getDefaultAvatarUrl = (userIdOrDiscriminator: string): string => {
 // For new username system (no discriminator), use ID
 const num = userIdOrDiscriminator === '0' || !userIdOrDiscriminator 
 ? 0 
 : parseInt(userIdOrDiscriminator) % 5;
 
 return `https://cdn.discordapp.com/embed/avatars/${num}.png`;
};