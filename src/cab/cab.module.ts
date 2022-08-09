import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingSchema } from "src/schemas/bookings.shema";
import { CabSchema } from "src/schemas/cab.schema";
import { CabController } from "./cab.controller";
import { CabService } from "./cab.service";


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: 'Cab', schema: CabSchema }]),
  ],
  providers: [CabService],
  exports: [CabService],
  controllers: [CabController],
})
export class CabModule { }
