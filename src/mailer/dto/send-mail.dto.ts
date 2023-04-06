export class SendMailDto {
	readonly from: string; // sender address
	readonly to: string; // list of receivers
	readonly subject: string; // Subject line
	readonly text: string; // plain text body
	readonly html: string; // html body
}
