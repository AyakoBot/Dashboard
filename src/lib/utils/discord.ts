// Discord CDN utilities

/**
 * Constructs a proper Discord CDN URL for guild icons
 */
export const getGuildIconUrl = (
 guildId: string,
 iconHash: string | null | undefined
): string | null => {
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
export const getUserAvatarUrl = (
 userId: string,
 avatarHash: string | null | undefined
): string | null => {
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
 const num =
  userIdOrDiscriminator === '0' || !userIdOrDiscriminator ? 0 : parseInt(userIdOrDiscriminator) % 5;

 return `https://cdn.discordapp.com/embed/avatars/${num}.png`;
};

/**
 * Sorts channels by their position property, respecting Discord's hierarchy.
 * Top-level channels (no parent_id) are sorted by position.
 * Categories (type 4) are immediately followed by their children, also sorted by position.
 * This maintains Discord's visual channel order.
 */
export const sortChannelsByPosition = <
 T extends { position: number; parent_id?: string | null; id: string; type: number }
>(
 channels: T[]
): T[] => {
 if (channels.length === 0) return [];

 const topLevel: T[] = [];
 const childrenByParent = new Map<string, T[]>();

 for (const channel of channels) {
  if (channel.parent_id === null || channel.parent_id === undefined) {
   topLevel.push(channel);
  } else {
   if (!childrenByParent.has(channel.parent_id)) {
    childrenByParent.set(channel.parent_id, []);
   }
   childrenByParent.get(channel.parent_id)!.push(channel);
  }
 }

 topLevel.sort((a, b) => a.position - b.position);

 for (const children of childrenByParent.values()) {
  children.sort((a, b) => a.position - b.position);
 }

 const result: T[] = [];
 const processedChildren = new Set<string>();

 for (const channel of topLevel) {
  result.push(channel);
  if (channel.type === 4 && childrenByParent.has(channel.id)) {
   const children = childrenByParent.get(channel.id)!;
   result.push(...children);
   children.forEach((child) => processedChildren.add(child.id));
  }
 }

 for (const [parentId, children] of childrenByParent.entries()) {
  const orphanedChildren = children.filter((child) => !processedChildren.has(child.id));
  if (orphanedChildren.length > 0) {
   result.push(...orphanedChildren);
  }
 }

 return result;
};
