import { Body, Request, Controller, Get, HttpStatus, Param, Post, Req, UseGuards, HttpCode, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { NearbyCabDto } from './dtos/nearby.dto';
import { BookingRo, ConfirmBookingRo } from './ros/bookin.ro';
import { NearbyCabRo } from './ros/nearbyCab.ro';
import { AuthGuard } from '@nestjs/passport'
import { decode } from 'jsonwebtoken';
import { BookingReqDto } from './dtos/booking.dto';
import { ResponseRo } from './ros/response.ro';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller()
@ApiTags("cab")
@ApiResponse({ status: 500, description: 'Internal server Error' })
export class AppController {
  constructor(
    private readonly appService: AppService) { }

  @Get()
  async getHello() {
    const response = await this.appService.getHello();
    return response;
  }

  @ApiResponse({ status: 200, description: 'Successful.' })
  @ApiOperation({ summary: 'Endpoint to get list of past bookings for perticular user.' })
  @Get('bookings')
  @UseGuards(AuthGuard('jwt'))
  async bookings(@Request() req: any): Promise<ResponseRo<BookingRo[]>> {
    const tokenData = decode(req.headers.authorization.replace('Bearer ', ''), { json: true }); //Accesing jwt-token from auth-header
    
    const res: BookingRo[] = await this.appService.pastBookings(tokenData._id);
    
    return {
      message: "List Of Bookings",
      statusCode: HttpStatus.OK,
      data: res
    };
  }

  @ApiOkResponse({ description: 'Successful.', type: [NearbyCabRo] })
  @ApiOperation({ summary: 'This endpoint gives list of cab which are nearby upto given distance' })
  @HttpCode(200)
  @Post("nearbyCabs")
  async getNearbyCabs(@Body() nearbyCabDto: NearbyCabDto): Promise<ResponseRo<NearbyCabRo[]>> {
    const result: NearbyCabRo[] = await this.appService.nearbyCabs(nearbyCabDto);
    
    return {
      message: "List Of NearBy Cabs",
      statusCode: HttpStatus.OK,
      data: result
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 201, description: 'Booking Request sent Successfully' })
  @ApiOperation({ summary: 'Send booking request to perticular cab' })
  @Post("book")
  async bookCab(@Body() bookingReq: BookingReqDto, @Request() req: any,): Promise<ResponseRo<ConfirmBookingRo>> {
    const tokenData = decode(req.headers.authorization.replace('Bearer ', ''), { json: true }); 
    
    const result = await this.appService.bookCab(bookingReq, tokenData._id);
    
    return {
      data: { bookingId: result },
      statusCode: HttpStatus.OK,
      message: "Booking Request Has Been Sent."
    }
  };
}


