import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MailerModule } from "src/mailer/mailer.module";
import { UsersModule } from "src/users/users.module";

@Module({
	providers: [AuthService],
	controllers: [AuthController],
	imports: [MailerModule, UsersModule],
})
export class AuthModule {}
