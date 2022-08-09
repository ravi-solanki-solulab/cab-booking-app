import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type bookingDocument = Booking & Document;
@Schema({ versionKey: false })
export class Booking {
    
    @Prop()
    userId: string;
    
    @Prop()
    cabId: string;

    @Prop()
    bookingAt: Date;

    @Prop({ type: Object })
    drop: Object;

    @Prop({ type : Object})
    pickup: Object;
    
    @Prop()
    bookingStatus: string;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);