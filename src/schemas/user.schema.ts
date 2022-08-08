import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type userDocument = User & Document;
@Schema({ versionKey : false })
export class User  {

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    password: string;

    @Prop()
    email: string;

    @Prop()
    mobileNo: string;
}
export const UserSchema = SchemaFactory.createForClass(User);