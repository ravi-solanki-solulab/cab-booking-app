import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsMongoId, ValidateNested } from 'class-validator';

export class LatLong {
    @ApiProperty()
    @IsLatitude()
    latitude: number;

    @ApiProperty()
    @IsLongitude()
    longitude: number;
}

export class BookingReqDto {
    @ApiProperty()
    @IsMongoId()
    cabId: string;

    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => LatLong)
    pickup: LatLong;

    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => LatLong)
    drop: LatLong
}

