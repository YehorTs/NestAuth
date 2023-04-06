import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("cats")
export class CatsController {
	@Get()
	findAll(): number {
		return 2.5;
	}
}
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}
