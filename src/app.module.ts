import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CabModule } from './cab/cab.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CabModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
  exports: [AppService],
})
export class AppModule { }
