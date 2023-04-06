import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UsersService } from "src/users/users.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { UserDocument } from "src/schemas/users.schema";
import config from "config";
import { MailerService } from "src/mailer/mailer.service";
import { NewPasswordDto } from "./dto/new-password.dto";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private mailerService: MailerService,
	) {}

	async signUp(signUpDto: SignUpDto) {
		const { username, email, password } = signUpDto;
		const abiturient = await this.usersService.findOne({
			$or: [
				{
					username,
				},
				{
					email,
				},
			],
		});
		if (abiturient) {
			throw new HttpException(
				"This username or email is already in use!",
				HttpStatus.BAD_REQUEST,
			);
		}
		const cryptedPassword = await bcrypt.hash(password, 8);
		const confirmLink = randomUUID();

		await this.usersService.create({
			...signUpDto,
			password: cryptedPassword,
			confirmLink,
		});

		return await this.mailerService.sendMail({
			from: "John Kostov <tsybulnik22@mail.ru>",
			to: email,
			subject: "Confirm Email",
			text: "",
			html: `
                <dev>
                    <h1>Link for confirm: </h1>
                    <a href=http://localhost:3000/auth/confirm-link/${confirmLink}>This</a>
                </dev>            
            `,
		});
	}

	async confirmLink(token: string) {
		const result = await this.usersService.update(
			{
				confirmLink: token,
			},
			{
				activeEmail: true,
			},
			{
				confirmLink: 1,
			},
		);

		if (!result.modifiedCount) {
			throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
		}
	}

	async login(signInDto: SignInDto) {
		const { login, password } = signInDto;
		const user = await this.validatePassword(signInDto);
		if (!user.activeEmail) {
			throw new HttpException(
				"Email not activated",
				HttpStatus.BAD_REQUEST,
			);
		}
		return await this.generateToken(user);
	}

	async validatePassword(signInDto: SignInDto) {
		const { login, password } = signInDto;
		const user = await this.usersService.findOne({
			$or: [
				{
					username: login,
				},
				{
					email: login,
				},
			],
		});

		if (!user) {
			throw new HttpException(
				"This user doesn' exist",
				HttpStatus.UNAUTHORIZED,
			);
		}
		const passwordEquals = await bcrypt.compare(password, user.password);

		if (passwordEquals) return user;
		throw new HttpException(
			"Aren't equals passwords",
			HttpStatus.UNAUTHORIZED,
		);
	}

	async validateToken(authHeader: string) {
		if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
			throw new HttpException("Помийся", HttpStatus.UNAUTHORIZED);
		}

		const token = authHeader.split(" ")[1];
		try {
			return await jwt.verify(token, config.privateKey);
		} catch {
			throw new HttpException("Помийся2", HttpStatus.UNAUTHORIZED);
		}
	}

	async generateToken(user: UserDocument) {
		return jwt.sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			config.privateKey,
			{
				expiresIn: "3m",
			},
		);
	}

	async resetUserPassword(userEmail: string) {
		try {
			const resetUrl = await this.usersService.getResetUrl(userEmail);

			return await this.mailerService.sendMail({
				from: "John Kostov <tsybulnik22@mail.ru>",
				to: userEmail,
				subject: "Reset Password",
				text: "",
				html: `
					<dev>
						<h1>Link for reset: </h1>
						<a href=http://localhost:3000/auth/reset-link/${resetUrl}>This</a>
					</dev>            
				`,
			});
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.BAD_GATEWAY);
		}
	}

	async setNewPassword(resetUrl: string, body: NewPasswordDto) {
		try {
			const user = await this.usersService.findOne({ resetUrl });
			if (user) {
				const newPassword = await bcrypt.hash(body.password, 8);
				return await this.usersService.update(
					{ resetUrl },
					{
						password: newPassword,
					},
					{
						resetUrl: 1,
					},
				);
			} else {
				throw new HttpException("User not found", HttpStatus.NOT_FOUND);
			}
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.BAD_GATEWAY);
		}
	}
}
