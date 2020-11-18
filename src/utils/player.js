import { log } from './logger.js'

const addReactions = (msg, emojis) => {
	try {
		for await (const emoji of emojis) {
			// A timeout to avoid rateLimits.
			setTimeout(() => {
				msg.react(emoji)
			}, 1000);
		}
	} catch (error) {
		log('error', 'playerReactionCollector@add_reactions', error)
	}
}

export const startReactionCollector = async (message, embed, time) => {
	try {
		/** Reactions */
		const emojis = ['⏮️', '⏭️', '⏸️', '⏹️', '🔁', '🔀']; // [prev, next, pause, stop, repeat, shuffle, cancel]
		try {
			await addReactions(emojis)
		} catch(error) {
			log('error', 'playerReactionCollector@startReactionCollector')
		}

		try {
			/** Collectors */
			const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
			const collector = await embed.createReactionCollector(filter, {
				time: 60000
			})

			collector.on('stop', async (reaction, user) => {
				embed.reactions.removeAll()
			}).on('collect', async (reaction, user) => {
				switch(reaction.emoji.name) {
					// Previous Song
					case emojis[0]:
						await message.channel.send('Coming Soon:tm:')
						break;

					// Next Song
					case emojis[1]:
						await message.client.player.skip(message)
						await message.channel.send({
							embed: {
								title: 'Track Skipped',
								color: 'BLUE',
								description: `Track successfully skipped by **${message.author.tag}**.\n${queue.songs[0] ? 'Proceeding to play the next track in the queue.' : 'The player has been stopped as no more songs are left to play.'}`,
								footer: { text: 'Run "crib play" or "crib search" to either play or search for a track.' }
							}
						})
						break;

					// Pause
					case emojis[2]: 
						await message.client.player.pause(message)
						await message.channel.send({
							embed: {
								title: 'Track Paused',
								color: 'BLUE',
								description: `Track successfully paused by **${message.author.tag}**.`,
								footer: { text: 'Run "crib play" or "crib search" to either play or search for a track.' }
							}
						})
						break;

					// Stop
					case emojis[3]:
						await message.client.player.stop(message);;
						await message.channel.send({
							embed: {
								title: 'Player Stopped',
								color: 'BLUE',
								description: `The player has been stopped by **${message.author.tag}**.`,
								footer: { text: 'Run "crib play" or "crib search" to either play or search for a track.' }
							}
						});
						break;

					// Loop
					case emojis[4]:
						const queue = message.client.player.getQueue(message);
						const mode = queue.repeatMode === 2 ? 0 : queue.repeatMode === 1 ? 2 : 0;
						// const mode = queue.repeatMode ? queue.repeatMode === 0 ? 1 : 2 : 0;
						await message.client.player.setRepeatMode(message, mode)
						await message.channel.send(`🔁 ${queue.repeatMode ? queue.repeatMode === 2 ? 'Now looping **__queue__**' : 'Now looping **__track__**' : 'Loop is now **__off__**'}`)
						break;

					// Shuffle
					case emojis[5]:
						await message.client.player.shuffle(message);
						break;

					// stop collector
					case emojis[6]:
						try {
							embed.reactions.removeAll();
							collector.stop();
						} catch(error) {
							log('error', 'playerReactionCollector@remove_emotes', error)
						}
						break;
				}
			})
		} catch(error) {
			log('error', 'playerReactionCollector@main_collector', error)
		}
	} catch(error) {
		log('error', 'playerReactionCollector@start_collector', error)
	}
}