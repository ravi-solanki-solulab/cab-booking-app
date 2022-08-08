import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { BookingSchema } from './schemas/bookings.shema';
import { CabSchema } from './schemas/cab.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name : 'Booking', schema: BookingSchema}]),
    MongooseModule.forFeature([{name: 'Cab', schema: CabSchema}]),
    HttpModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtStrategy,
    JwtService],
  exports: [AppService],
})
export class AppModule { }
