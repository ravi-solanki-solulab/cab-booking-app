
import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsNumber } from "class-validator";

export class NearbyCabDto {
    @ApiProperty()
    @IsNumber()
    distance: number; // in meter unit

    @ApiProperty()
    @IsLatitude()
    latitude: number;

    @ApiProperty()
    @IsLongitude()
    longitude: number;
}