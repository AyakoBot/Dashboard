// place files you want to import through the `$lib` alias in this folder.
import '@unocss/reset/normalize.css';
import '@unocss/reset/sanitize/sanitize.css';
import '@unocss/reset/sanitize/assets.css';
import '@unocss/reset/eric-meyer.css';
import '@unocss/reset/tailwind.css';
import '@unocss/reset/tailwind.css';

export type ConsentCookie = {
	'strictly-necessary': true;
	functionality: boolean;
	tracking: boolean;
	targeting: boolean;
};

// ShortURLs
import type { GETResponse as GETShortUrls } from '@ayako/server/src/routes/v1/@me/short-urls/+server';
import type { GETResponse as GETShortUrlUses } from '@ayako/server/src/routes/v1/@me/short-urls/[id]/uses/+server';
// Self
import type { GETResponse as GETSelf } from '@ayako/server/src/routes/v1/@me/+server';
import type { POSTResponse as POSTAuthGenerate } from '@ayako/server/src/routes/v1/@me/auth/generate/+server';
import type { GETResponse as GETSelfGuilds } from '@ayako/server/src/routes/v1/@me/guilds/+server';
// Appeals
import type { GETResponse as GETAppealsGuilds } from '@ayako/server/src/routes/v1/@me/appeals/guilds/+server';
import type { GETResponse as GETGuildAppealQuestions } from '@ayako/server/src/routes/v1/guilds/[guildId]/settings/appeal-questions/+server';
import type { GETResponse as GETPunishmentStatus } from '@ayako/server/src/routes/v1/punishments/[punishmentId]/status/+server';
// Guilds
import type { GETResponse as GETGuilds } from '@ayako/server/src/routes/v1/guilds/+server';
import type { GETResponse as GETGuild } from '@ayako/server/src/routes/v1/guilds/[guildId]/+server';
import type { GETResponse as GETGuildLeaderboard } from '@ayako/server/src/routes/v1/guilds/[guildId]/lb/+server';
// Punishments
import type { GETResponse as GETPunishments } from '@ayako/server/src/routes/v1/@me/punishments/+server';
import type { GETResponse as GETPunishment } from '@ayako/server/src/routes/v1/punishments/[punishmentId]/+server';
// QOTD
import type { GETResponse as GETqotd } from '@ayako/server/src/routes/v1/qotd/+server';
// Linked-Roles Decoration
import type { GETResponse as GETLinkedRolesDecoration } from '@ayako/server/src/routes/v1/guilds/[guildId]/linked-roles/[settingsId]/decoration/+server';
// Bot
import type { GETResponse as GETBotStats } from '@ayako/server/src/routes/v1/bot/stats/+server';
import type { GETResponse as GETBotReviews } from '@ayako/server/src/routes/v1/bot/reviews/+server';
import type { GETResponse as GETBotFeatures } from '@ayako/server/src/routes/v1/bot/features/+server';
import type { GETResponse as GETBotContributers } from '@ayako/server/src/routes/v1/bot/contributers/+server';
import type { GETResponse as GETBotArtworks } from '@ayako/server/src/routes/v1/bot/artworks/+server';
// URL Scan
import type { PUTResponse as PUTUrlScan } from '@ayako/server/src/routes/v1/url-scan/+server';
import type { PATCHResponse as PATCHUrlScan } from '@ayako/server/src/routes/v1/url-scan/+server';
// RP
import type { GETResponse as GETSelfRPBlocks } from '@ayako/server/src/routes/v1/@me/rp/+server';
// Users
import type { PUTResponse as PUTFindUsers } from '@ayako/server/src/routes/v1/users/find-many/+server';
import type { GETResponse as GETSearchUsers } from '@ayako/server/src/routes/v1/users/search/+server';
// Reminders
import type { GETResponse as GETReminders } from '@ayako/server/src/routes/v1/@me/reminders/+server';
import type { POSTResponse as POSTReminder } from '@ayako/server/src/routes/v1/reminders/+server';
import type { GETResponse as GETReminder } from '@ayako/server/src/routes/v1/reminders/[reminderId]/+server';

type GETEndpointMap = {
	// ++++ Documented ++++
	// @me
	'/@me': GETSelf;
	'/@me/guilds': GETSelfGuilds;

	'/@me/short-urls': GETShortUrls;
	'/@me/short-urls/:id/uses': GETShortUrlUses;

	'/@me/punishments': GETPunishments;
	'/@me/appeals/guilds': GETAppealsGuilds;

	// Punishments
	'/punishments/:punishmentId/status': GETPunishmentStatus;
	'/punishments/:punishmentId': GETPunishment;

	// Guilds
	'/guilds': GETGuilds;
	'/guilds/:guildId': GETGuild;
	'/guilds/:guildId/lb': GETGuildLeaderboard;
	'/guilds/:guildId/settings/appeal-questions': GETGuildAppealQuestions;
	'/guilds/:guildId/linked-roles/:settingsId/decoration': GETLinkedRolesDecoration;

	// QOTD
	'/qotd': GETqotd;

	// Bot
	'/bot/stats': GETBotStats;
	'/bot/reviews': GETBotReviews;
	'/bot/features': GETBotFeatures;
	'/bot/contributers': GETBotContributers;
	'/bot/artworks': GETBotArtworks;

	// URL Scan
	'/url-scan/:scanId': never;

	// RP
	'/@me/rp': GETSelfRPBlocks;

	// ++++ Undocumented ++++
	// Users
	'/users/search': GETSearchUsers;
	// Reminders
	'/@me/reminders': GETReminders;
	'/reminders/:reminderId': GETReminder;
};

type POSTEndpointMap = {
	// ++++ Documented ++++
	// Appeals
	'/@me/auth/generate': POSTAuthGenerate;
	'/punishments/:punishmentId/appeal': never;
	// URL Scan
	'/url-scan': never;
	// RP
	'/@me/rp': never;

	// ++++ Undocumented ++++
	// Reminder
	'/reminders': POSTReminder;
};

type PUTEndpointMap = {
	// ++++ Documented ++++
	// URL Scan
	'/url-scan': PUTUrlScan;

	// ++++ Undocumented ++++
	// Users
	'/users/find-many': PUTFindUsers;
};

type PATCHEndpointMap = {
	// ++++ Documented ++++
	// URL Scan
	'/url-scan': PATCHUrlScan;
	// RP
	'/@me/rp': never;
};

type DELETEEndpointMap = {
	// ++++ Documented ++++
	// RP
	'/@me/rp': never;

	// ++++ Undocumented ++++
	// Reminder
	'/reminders/:reminderId': never;
};

export type EndpointMap = {
	GET: GETEndpointMap;
	POST: POSTEndpointMap;
	PUT: PUTEndpointMap;
	PATCH: PATCHEndpointMap;
	DELETE: DELETEEndpointMap;
};

export type EndpointArgMap = {
	'/@me/short-urls/:id/uses': 'id';
	'/guilds/:guildId/settings/appeal-questions': 'guildId';
	'/guilds/:guildId': 'guildId';
	'/guilds/:guildId/lb': 'guildId';
	'/guilds/:guildId/linked-roles/:settingsId/decoration': 'guildId' | 'settingsId';
	'/punishments/:punishmentId/appeal': 'punishmentId';
	'/punishments/:punishmentId/status': 'punishmentId';
	'/url-scan/:scanId': 'scanId';
	'/reminders/:reminderId': 'reminderId';
} & Record<string, never>;
