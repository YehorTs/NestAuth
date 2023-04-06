import { Module, Global } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/users.schema";

@Module({
	providers: [UsersService],
	controllers: [UsersController],
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	exports: [UsersService],
})
export class UsersModule {}
