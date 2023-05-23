import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async signPayload(payload) {
        return sign(payload, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRE_IN });
    }

    async validateUser(payload): Promise<any> {
        return await this.userService.findByPaylaod(payload.email);
    }
}
