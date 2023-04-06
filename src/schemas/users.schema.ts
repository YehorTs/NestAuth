import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ required: true })
	username: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true, default: false })
	activeEmail: boolean;

	@Prop()
	confirmLink: string;

	@Prop()
	resetUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
