import config from './config.js'
import Musicord from './classes/Client.js'

import { commandListener } from './listeners/commandListener.js'
import { playerEventListener } from './listeners/playerEventListener.js'
import { discordEventListener } from './listeners/discordEventListener.js'

import { logInit, logError } from './utils/logger.js'

export const run = async() => {
	try {
		/** Process Error: unhandledRejection */
		process.on('unhandledRejection', async (error) => {
			await logError('Main', 'unhandledRejection', error)
		})
		/** Process Error: uncaughtException */
		process.on('uncaughtException', async (error) => {
			await logError('Main', 'uncaughtException', error)
		})
	} catch(error) {
		await logError('Main', 'process error handler', error)
		process.exit(1)
	}

	try {
		if (config.token) {
			await logInit('Main', 'Launching Musicord...')
			await musicord()
		}
	} catch(error) {
		await logError('Main', 'invalid or unknown token', error)
		process.exit(1)
	}
}

const musicord = async () => {
	const bot = new Musicord(config.clientOpts, config.playerOpts);

	/** Listeners */
	const listeners = [
		commandListener,
		playerEventListener,
		discordEventListener
	]

	for (const listener of listeners) {
		try {
			listener.run(bot)
			await logInit('Main', 'Process Loaded')
		} catch(error) {
			await logError('Main', 'cannot process listeners', error)
			process.exit(1)
		}
	}

	/** Login our bot */
	try {
		await bot.login(token);
	} catch(error) {
		await logError('Main', 'unable to login', error)
		process.exit(1)
	}
}

/** Run the whole bot */
try {
	run()
	logInit('Main', 'Bot initialized')
} catch(error) {
	logError('Main', 'Bot failed to run', error)
}