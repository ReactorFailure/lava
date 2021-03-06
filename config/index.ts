import { CurrencyType, currencyConfig } from './currency';
import { ConfigInterface, lavaConfig } from './lava';
import { SpawnConfig, spawnConfig } from './spawn';
import { akairoConfig } from './akairo';
import { discordOptions } from './discord';
import { AkairoOptions } from 'discord-akairo';
import { ClientOptions } from 'discord.js';

export interface Config {
  currency: CurrencyType;
  discord: ClientOptions;
  akairo: AkairoOptions;
  spawn: SpawnConfig;
  bot: ConfigInterface;
}

export const config: Config = {
  currency: currencyConfig,
  discord: discordOptions,
  akairo: akairoConfig,
  spawn: spawnConfig,
  bot: lavaConfig,
};
