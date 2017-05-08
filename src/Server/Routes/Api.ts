import { Guild, GuildMember } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Request, Response, Router } from 'express';

interface MemberResult {
	id: string;
	name: string;
	avatarURL: string;
	displayName: string;
	displayColor: number;
	displayHexColor: string;
};

export class Api {
	public route: Router;
	private client: CommandoClient;

	constructor(client: CommandoClient) {
		this.client = client;

		this.route = Router();

		this.route.get('/:id/members', (req: Request, res: Response) => {
			const guild: Guild = this.client.guilds.get(req.params.id);
			if (guild) {
				guild.fetchMembers()
					.then((result: Guild) => {
						const members: MemberResult[] = [];
						result.members.forEach((member: GuildMember) => {
							members.push({
								id: member.id,
								name: member.user.username,
								avatarURL: member.user.displayAvatarURL,
								displayName: member.displayName,
								displayColor: member.displayColor,
								displayHexColor: member.displayHexColor
							});
						});
						res.send({ status: 200, members });
					});
			} else {
				res.send({ status: 404 });
			}
		});

	}

	public get(): Router {
		return this.route;
	}
}
