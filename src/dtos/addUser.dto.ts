import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class AddUserDto { 
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName : string;
    
    @ApiProperty()
    @IsString()
    password : string;
    
    @ApiProperty()
    @IsEmail()
    email:string;
    
    @ApiProperty()
    @IsNumberString()
    mobile:string;
}