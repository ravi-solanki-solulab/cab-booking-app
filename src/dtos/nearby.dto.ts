
import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLatLong, IsNotEmpty, IsNumber } from "class-validator";

export class NearbyCabDto {
    @ApiProperty()
    @IsNumber()
    distance: number; // in meter unit

    @ApiProperty()
    @IsLatLong()
    latitude: number;
    
    @ApiProperty()
    @IsLatitude()
    longitude: number;
}