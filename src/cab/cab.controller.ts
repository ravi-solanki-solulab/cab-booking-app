import { Body, Request, Controller, HttpStatus, Post, UseGuards, Get, Query, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingReqDto } from 'src/dtos/booking.dto';
import { BookingRo, ConfirmBookingRo } from 'src/ros/bookin.ro';
import { ResponseRo } from 'src/ros/response.ro';
import { decode } from 'jsonwebtoken';
import { CabService } from './cab.service';
import { NearbyCabRo } from 'src/ros/nearbyCab.ro';
import { NearbyCabDto } from 'src/dtos/nearby.dto';

@ApiBearerAuth()
@Controller()
@ApiTags("cab")
@Controller('cab')
export class CabController {
    constructor(
        private readonly cabService: CabService) { }

    //endpoint to get list of past bookings    
    @ApiResponse({ status: 200, description: 'Successful.' })
    @ApiOperation({ summary: 'Endpoint to get list of past bookings for perticular user.' })
    @Get('bookings')
    @ApiQuery({ name: 'pageNumber', required: false })
    @ApiQuery({ name: 'pageSize', required: false })
    @UseGuards(AuthGuard('jwt'))
    async bookings(@Request() req: any, @Query('pageNumber') pageNumber: any = 1, @Query('pageSize') pageSize: any = 2): Promise<ResponseRo<BookingRo[]>> {
        const tokenData = decode(req.headers.authorization.replace('Bearer ', ''), { json: true }); //Accesing jwt-token from auth-header

        const res: BookingRo[] = await this.cabService.pastBookings(tokenData._id, parseInt(pageNumber), parseInt(pageSize));

        return {
            message: "List Of Bookings",
            statusCode: HttpStatus.OK,
            data: res
        };
    }

    //endpoint to get list of cabs nearby up to given distance
    @ApiOkResponse({ description: 'Successful.', type: [NearbyCabRo] })
    @ApiOperation({ summary: 'This endpoint gives list of cab which are nearby upto given distance' })
    @HttpCode(200)
    @Post("nearbyCabs")
    async getNearbyCabs(@Body() nearbyCabDto: NearbyCabDto): Promise<ResponseRo<NearbyCabRo[]>> {
        const result: NearbyCabRo[] = await this.cabService.nearbyCabs(nearbyCabDto);

        return {
            message: "List Of NearBy Cabs",
            statusCode: HttpStatus.OK,
            data: result
        };
    }

    //endpoint to send booking req to perticular cab
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 201, description: 'Booking Request sent Successfully' })
    @ApiOperation({ summary: 'Send booking request to perticular cab' })
    @Post("book")
    async bookCab(@Body() bookingReq: BookingReqDto, @Request() req: any,): Promise<ResponseRo<ConfirmBookingRo>> {
        const tokenData = decode(req.headers.authorization.replace('Bearer ', ''), { json: true });

        const result = await this.cabService.bookCab(bookingReq, tokenData._id);

        return {
            data: { bookingId: result },
            statusCode: HttpStatus.OK,
            message: "Booking Request Has Been Sent."
        }
    };
}
