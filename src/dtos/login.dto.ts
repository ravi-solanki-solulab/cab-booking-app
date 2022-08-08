import { IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto { 
    @ApiProperty()
    @IsString()
    email: string;
    
    @ApiProperty()
    @IsString()
    password :string;
}