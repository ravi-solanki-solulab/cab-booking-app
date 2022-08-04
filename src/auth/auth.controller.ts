import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddUserDto } from 'src/dtos/addUser.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('auth')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Internal server Error' })
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }
    
    @ApiCreatedResponse({ description: "New User Registered with Proided Details" })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiOperation({ summary: "Register New User" })
    @Post('addUser')
    async addUser(@Body() addUserDto: AddUserDto): Promise<any> {
        const user = await this.userService.addUser(addUserDto);

        return {
            statusCode: HttpStatus.CREATED,
            message : "User Registerd Successfully.",
            data: {
                userId: user._id
            }
        }
    }
    @HttpCode(200)
    @ApiOkResponse({ description: "User Loged In Successfully" })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiOperation({ summary: "Login Endpoint" })
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        const user = await this.userService.findUser(loginDto);
        const payload = { email: user.email, _id: user._id }
        const token = await this.authService.signPayload(payload);
        return {
            data: {
                statusCode: HttpStatus.OK,
                userId: user._id,
                token: token
            }
        };
    }
}
