import { IsString, isString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    @IsString()
    firstName: string;
    @ApiProperty()
    @IsString()
    lastName: string;
    @ApiProperty()
    @IsString()
    email: string;
    @ApiProperty()
    @IsString()
    mobileNo: string;
}
