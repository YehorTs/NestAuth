import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import config from "config";
const jwt = require("jsonwebtoken");

@Injectable()
export class AuthGuard implements CanActivate {
	constructor() {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { authHeader } = request.headers;
		if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
			throw new HttpException("Помийся La la", HttpStatus.UNAUTHORIZED);
		}

		const token = authHeader.split(" ")[1];
		try {
			jwt.verify(token, config.privateKey);
			return true;
		} catch {
			throw new HttpException("Помийся2 La la", HttpStatus.UNAUTHORIZED);
		}
	}
}
