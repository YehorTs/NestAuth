import {
	Body,
	Controller,
	Post,
	Get,
	Headers,
	Param,
	Query,
} from "@nestjs/common";
import { CreateUsersDto } from "src/users/dto/create-users.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { UsersService } from "src/users/users.service";
import { NewPasswordDto } from "./dto/new-password.dto";

@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
	) {}
	@Get("validate")
	async validateToken(@Headers() headers: Record<string, string>) {
		return this.authService.validateToken(headers.auth);
	}

	@Post("sign-up")
	async signUp(@Body() createUsersDto: CreateUsersDto) {
		return await this.authService.signUp(createUsersDto);
	}

	@Post("sign-in")
	async singIn(@Body() signInDto: SignInDto) {
		return this.authService.login(signInDto);
	}

	@Get("confirm-link/:token")
	async confirmLink(@Param("token") token: string) {
		await this.authService.confirmLink(token);
	}

	@Get("remove-user/:email")
	async removeUser(@Param("email") email: string) {
		await this.usersService.remove({
			email,
		});
	}

	@Get("reset-password")
	async resetUserPassword(@Query("email") email: string) {
		await this.authService.resetUserPassword(email);
	}

	@Post("reset-link")
	async setNewPassword(
		@Query("resetUrl") resetUrl: string,
		@Body() body: NewPasswordDto,
	) {
		await this.authService.setNewPassword(resetUrl, body);
	}
}
