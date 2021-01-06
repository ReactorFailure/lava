import { LavaClient, LavaCommand, Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { inspect } from 'util'

export default class Dev extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('eval', {
      aliases: ['eval', 'ev'],
      channel: 'guild',
      ownerOnly: true,
      args: [
        { id: 'code', match: 'content' }
      ]
    });
  }

  private inspect(obj: any, options: object): any {
    return inspect(obj, options);
  }

  private codeBlock(str: string, lang: string = 'js'): string {
    return [
      `\`\`\`${lang}`,
      str, '```'
    ].join('\n');
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { guild, channel } = _;
    const code: string = args.code;
    const asynchronous: boolean = code.includes('await') || code.includes('return');
    let before, evaled, evalTime, type, token, result;

    const embed: Message = await channel.send({ embed: {
      color: 'ORANGE',
      description: 'Evaluating, please wait...',
      footer: {
        iconURL: this.client.user.avatarURL({ dynamic: true }),
        text: this.client.user.username
      }
    }});

    before = Date.now();
    try {
      evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
    } catch(error) {
      evaled = error.message;
    }
    evalTime = Date.now() - before;
    type = typeof evaled;

    if (type !== 'string') {
      evaled = this.inspect(evaled, { depth: 0 });
    }

    token = new RegExp(this.client.token, 'gi');
    evaled = evaled.replace(token, 'N0.T0K4N.4Y0U');
    return embed.edit({ embed: {
      color: 'ORANGE',
      description: this.codeBlock(evaled),
      fields: [
        { name: 'Type', value: this.codeBlock(type) },
        { name: 'Latency', value: this.codeBlock(`${evalTime}ms`) }
      ]
    }});
  }
}