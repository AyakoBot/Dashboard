<script lang="ts">
	import { PUBLIC_HOSTNAME, PUBLIC_ID } from '$env/static/public';

	const perfectLogin = `https://discord.com/oauth2/authorize?client_id=${PUBLIC_ID}&response_type=code&redirect_uri=${PUBLIC_HOSTNAME}%2Flogin&scope=identify+guilds+guilds.channels.read+applications.builds.read+relationships.read+applications.commands.permissions.update+guilds.join+messages.read+guilds.members.read+applications.store.update+gateway.connect`;
</script>

Hiya