import 'module-alias/register';
import 'dotenv/config';
import { Lava } from '@lib/Lava';
import { SpawnConfig } from '@lib/interface/handlers';
import { config } from '@config/index';

new Lava(config).build();
