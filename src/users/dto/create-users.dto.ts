export class CreateUsersDto {
	readonly username: string;
	readonly email: string;
	readonly password: string;
	readonly confirmLink: string;
}
