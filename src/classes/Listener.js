import { log } from '../utils/logger.js'

class Listener {
	constructor(client) {
		this.client = client;
	}

	/** Logger Shortcut */
	log(Class, tag, error) {
		return log(Class, 'listener', tag, error);
	}

	/** Creates an Embed */
	createEmbed({
		author = {}, fields = {}, footer = {},
		title = null, icon = null, text = null,
		color = 'RANDOM'
	} = {}) {
		return this.client.utils.dynamicEmbed({
			author, fields, footer,
			title, text, icon, color
		});
	}
}

export default Listener;