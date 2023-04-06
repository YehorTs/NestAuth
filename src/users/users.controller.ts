import { Controller, UseGuards, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get("get-user/:id")
	getUser(@Param("id") id: string) {
		return true;
	}
}
