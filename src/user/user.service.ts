import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { LoginDto } from 'src/dtos/login.dto';
import { AddUserDto } from '../dtos/addUser.dto';
import * as bcrypt from 'bcrypt';
import { COLLECTION_NAMES } from 'src/constants/status';
import { UserModule } from './user.module';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectConnection() private connection: Connection,
    @InjectModel('User') private userModel : Model<UserModule> ) { }

    async addUser(userData: AddUserDto): Promise<any> {

        const userCheck = await this.userModel.findOne({email: userData.email});
        //Checking if user already exist with provided emailId
        if (userCheck) {
            throw new BadRequestException('User Already Exists With Provide Email')
        }

        //To store hashed password instade of plain password
        const saltOrRounds = 10;
        const password = userData.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        userData.password = hash;
       
        const createduser = new this.userModel(userData);
        const newUserRes = await createduser.save();
     
        return newUserRes._id;

    }
    
    async findUser(loginDto: LoginDto): Promise<any> {
        const user: User = await this.userModel.findOne({email: loginDto.email}); 
    
        if(user){
            const matchPassword = await bcrypt.compare(loginDto.password, user.password );//Compairing given password with stored password 
            if (!matchPassword) {
                throw new BadRequestException("Wrong Password");
            }
        }
        else {
            throw new HttpException("User Not Found ", HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    async findByPaylaod(payload): Promise<any> {
        return await this.connection.db.collection(COLLECTION_NAMES.USERS).find(payload.email);
    }
}
