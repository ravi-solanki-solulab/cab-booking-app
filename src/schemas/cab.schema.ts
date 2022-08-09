
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type cabDocument = Cab & Document;
@Schema({ versionKey: false })
export class Cab extends Document {

    @Prop()
    title: string;
    
    @Prop()
    driverName: string;
    
    @Prop()
    contact: string;
    
    @Prop()
    status: string;
    
    @Prop( { type : Object})
    location: Object

}

export const CabSchema = SchemaFactory.createForClass(Cab)



