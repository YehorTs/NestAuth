import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { FindUsersDto } from "./dto/find-users.dto";
import { UpdateUsersDto } from "./dto/update-users.dto";
import { CreateUsersDto } from "./dto/create-users.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/schemas/users.schema";
import { Model } from "mongoose";
import { UnsetUserDto } from "./dto/unset-user.dto";
import { randomUUID } from "crypto";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	async create(createUsersDto: CreateUsersDto): Promise<UserDocument> {
		return await this.userModel.create(createUsersDto);
	}

	async findOne(findUserDto: FindUsersDto) {
		return this.userModel.findOne(findUserDto);
	}

	async remove(findUserDto: FindUsersDto) {
		return this.userModel.deleteOne(findUserDto);
	}

	async update(
		findUserDto: FindUsersDto,
		updateUserDto: UpdateUsersDto,
		unsetUserDto?: UnsetUserDto,
	) {
		return this.userModel.updateOne(
			findUserDto,
			{ $set: updateUserDto, $unset: unsetUserDto },
			{ new: true },
		);
	}

	async getResetUrl(userEmail: string) {
		const user = await this.userModel.find({ email: userEmail });
		if (user) {
			const resetUrl = randomUUID();
			await this.userModel.updateOne(
				{
					email: userEmail,
				},
				{
					resetUrl,
				},
			);
			return resetUrl;
		}
		throw new HttpException("User not found", HttpStatus.NOT_FOUND);
	}
}
