import { blue } from './colors.js'

export const simpleEmbed = (message, content) => {
	return {
		color: blue,
		author: {
			name: content > 200 ? `${content.substr(0, 200)}...` : content,
			iconURL: message.client.user.avatarURL()
		}
	}
}

export const playerEmbed = (message, title, description, [...fields]) => {
	return {
		color: blue,
		title,
		description,
		fields: [...fields],
		footer: { text: `Thanks for using ${message.client.user.username}` }
	}
}