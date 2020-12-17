import Command from '../../classes/Command/Filter.js'
import { log } from '../../utils/logger.js'
import { 
	dynamicEmbed, 
	errorEmbed 
} from '../../utils/embed.js'

export default new Command({
	name: 'info',
	aliases: ['botinfo', 'about'],
	description: 'View some information brought to you by Discord and Musicord.',
	usage: 'command'
}, async (bot, message) => {
	try {
		/** Fetch <Client> application from OAuth2 */
		const application = await bot.fetchApplication();
		/** Return Message */
		return dynamicEmbed({
			title: `${application.name} - ${application.id}`,
			color: 'BLUE',
			text: application.description,
			icon: application.iconURL(),
			fields: {
				'Text': { content: bot.channels.size.toLocaleString(), 	inline: true },
				'Users': {content: bot.users.size.toLocaleString(),			inline: true }
			}
		});
	} catch(error) {
		log('commandError', 'info@main_command', error);
		return errorEmbed({ title: 'info@main_command', error: error });
	}
})