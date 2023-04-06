import { Types } from "mongoose";

export class FindUsersDto {
	readonly _id?: Types.ObjectId;
	readonly username?: string;
	readonly email?: string;
	readonly confirmLink?: string;
	readonly $or?: [
		{
			readonly username: string;
		},
		{
			readonly email: string;
		},
	];
	readonly resetUrl?: string;
}
