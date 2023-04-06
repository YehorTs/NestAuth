import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { MailerModule } from "./mailer/mailer.module";
import config from "config";

@Module({
	imports: [
		UsersModule,
		MongooseModule.forRoot(config.url),
		AuthModule,
		MailerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
