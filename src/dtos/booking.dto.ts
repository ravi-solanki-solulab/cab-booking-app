import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";
import { IsLatLong } from '@nestjs/class-validator';
import { IsMongoId, ValidateNested } from 'class-validator';

export class LatLong { 
    @ApiProperty()
    @IsLatLong()
    latitude : number;

    @ApiProperty()
    @IsLatLong()
    longitude: number;
} 

export class BookingReqDto { 
    @ApiProperty()
    @IsMongoId()
    cabId : string;

    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => LatLong)
    pickup : LatLong;
    
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => LatLong)
    drop: LatLong
}

