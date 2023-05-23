import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class LatLong { 
    @ApiProperty()
    latitude : number;
    @ApiProperty()
    longitude: number;
} 

export class BookingReqDto { 
    @ApiProperty()
    cabId : string;
    @ApiProperty()
    @Type(() => LatLong)
    pickup : LatLong;
    @ApiProperty()
    @Type(() => LatLong)
    drop: LatLong


}

