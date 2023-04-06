import { Module, Global } from "@nestjs/common";
import { MailerService } from "./mailer.service";

@Module({
	providers: [MailerService],
	exports: [MailerService],
})
export class MailerModule {}
