import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed,
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'resume',
	aliases: ['unfreeze'],
	description: 'resume playing the current queue',
	usage: 'command'
}, async (bot, message, args) => {

	/** Check if paused */
	const paused = bot.player.isPaused(message);
	if (!paused) {
		return simpleEmbed(message, 'The player is not paused.');
	}

	/** Else, resume */
	try {
		await bot.player.resume(message);
		return dynamicEmbed({
			title: 'Player Resumed',
			color: 'BLUE',
			info: 'The player has resumed playing tracks.',
			fields: {
				'Action by': { content: message.author.tag }
			},
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		});
	} catch(error) {
		log('commandError', 'resume', error.stack);
		return errorEmbed(message, error);
	}
})