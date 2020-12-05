import { Client, Collection, ClientPresence } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

import DisTube from './DisTube.js'

/**
 * Represents a Musicord client extending Client
 * @class @extends client
 */
export default class Musicord extends Client {
	/**
	 * The base constructor for Musicord
	 * @param {ClientOptions} clientOptions Discord.Client options
	 * @param {DisTubeOptions} playerOptions DisTube options
	 */
	constructor(clientOptions, playerOptions) {
		super(clientOptions(this));

		/**
		 * Bot Presence
		 * @type {ClientPresence}
		 */
		this.presence = new ClientPresence(this, {
			client_status: {
				web: 'offline',
				mobile: 'online',
				desktop: 'offline'
			}
		})

		/**
		 * Bot Package
		 * @type {Object}
		 */
		this.package = require('../../package.json');

		/**
		 * DisTube Player
		 * @type {DisTube}
		 */
		this.distube = new DisTube(this, playerOptions);

		/**
		 * The main config
		 * @type {Object}
		 */
		this.config = require('../config/default.js').default;

		/**
		 * Musicord Utilities
		 * @type {Object}
		 */
		this.utils = new (require('./Util.js').default)(this);

		/**
		 * Musicord managers
		 * @type {Collection<string, Manager>}
		 */
		this.managers = new Collection();

		/**
		 * Musicord commands
		 * @type {Collection<string, Command>}
		 */
		this.commands = new Collection();

		/**
		 * Command Aliases
		 * @type {Collection<string, Command>}
		 */
		this.aliases = new Collection();

		/**
		 * Command Cooldowns
		 * @type {Collection<string, Collection<Snowflake, Number>}
		 */
		this.cooldowns = new Collection();

		
		this.loadAll();
	}

	
	get prefix() {
		return this.config.prefix;
	}

	get developers() {
		return this.config.developers(this).map(dev => dev.id);
	}

	/**
	 * Loads all functions
	 */
	loadAll() {
		this.hydrateListeners();
		this.importCommands();
		this.handleManagers();
	}

	/**
	 * Starts listening for individual distube/discord events
	 * @returns {void}
	 */
	hydrateListeners() {
		try {
			/* Check every inch of emitters */
			const emitters = readdirSync(join(__dirname, '..', 'emitters'));
			emitters.forEach(e => {
				const emitter = readdirSync(join(__dirname, '..', 'emitters', e));
				emitter.forEach(l => {
					new (require(join(__dirname, '..', 'emitters', e, l)).default)(this);
				});
			});

			/* Log it */
			this.utils.log('Musicord', 'main', 'Loaded: Listeners');
		} catch(error) {
			this.utils.log('Musicord', 'error', 'Error: HydrateListeners', error);
		}
	}

	/**
	 * Imports and registers commands and it's aliases in Musicord.commands collection
	 * @returns {void}
	 */
	importCommands() {
		try {
			const commands = readdirSync(join(__dirname, '..', 'commands'));
			commands.forEach(i => {
				/* Function */
				const load = command => {
					this.commands.set(command.name, command);
					command.aliases.forEach(a => this.aliases.set(a, command));
				}
				/* Import File */
				if (i.endsWith('.js')) {
					const command = new (require(join(__dirname, '..', 'commands', i)).default)(this);
					load(command);
				} 
				/* Import File in Folder */
				else {
					const dir = readdirSync(join(__dirname, '..', 'commands', i));
					dir.forEach(c => {
						const command = new (require(join(__dirname, '..', 'commands', i, c)).default)(this);
						load(command);
					});
				}
			});

			/* Log it */
			this.utils.log('Musicord', 'main', 'Loaded: Commands');
		} catch(error) {
			this.utils.log('Musicord', 'error', 'Error: ImportCommands', error);
		}
	}

	/**
	 * Handles and registers all managers
	 * @returns {void}
	 */
	handleManagers() {
		try {
			const managers = readdirSync(join(__dirname, '..', 'managers'));
			managers.forEach(m => {
				m = m.split('.')[0];
				const manager = new (require(join(__dirname, '..', 'managers', m)).default)(this);
				this.managers.set(m, manager);
			});

			/* Log it */
			this.utils.log('Musicord', 'main', 'Loaded: Managers');
		} catch(error) {
			this.utils.log('Musicord', 'error', 'Error: ManagersLoader', error);
		}
	}
}