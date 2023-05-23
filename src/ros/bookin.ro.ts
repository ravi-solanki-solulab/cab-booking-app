import { ApiProperty } from '@nestjs/swagger';
import { Date } from 'mongoose';

export class GeoLocation {
  @ApiProperty()
  type: string;
  @ApiProperty()
  coordinated: [number, number];
}

export class BookingRo {
  @ApiProperty()
  _id?: string;
  @ApiProperty()
  bookingAt?: Date;
  @ApiProperty()
  drop?: GeoLocation;
  @ApiProperty()
  pickup?: GeoLocation;
  @ApiProperty()
  cabDetails?: CabDetails;
}

export class CabDetails {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  driverName: string;
  @ApiProperty()
  contact: string;
}

export class ConfirmBookingRo {
  @ApiProperty()
  bookingId: string;
}
