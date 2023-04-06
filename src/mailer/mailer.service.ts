import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SendMailDto } from "./dto/send-mail.dto";

@Injectable()
export class MailerService {
	constructor() {
		this.setTransporter();
	}
	private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

	async setTransporter() {
		const transporter = nodemailer.createTransport({
			host: "smtp.mail.ru",
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: "tsybulnik22@mail.ru", // generated ethereal user
				pass: "wNqMsEsefyewEWabzQxE", // generated ethereal password
			},
		});
		this.transporter = transporter;
	}

	async sendMail(sendMailDto: SendMailDto) {
		return await this.transporter.sendMail(sendMailDto);
	}
}
