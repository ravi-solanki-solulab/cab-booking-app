import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, isObjectIdOrHexString, Model } from "mongoose";
import { HttpService } from '@nestjs/axios';
import { BookingRo } from './ros/bookin.ro';
import { NearbyCabDto } from './dtos/nearby.dto';
import { NearbyCabRo } from './ros/nearbyCab.ro';
import { BookingReqDto } from './dtos/booking.dto';
import { BOOKING_STATUS, CAB_STATUS } from './constants/status';
import { bookingDocument } from './schemas/bookings.shema';
import { cabDocument } from './schemas/cab.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel('Booking') private bookingModel: Model<bookingDocument>,
    @InjectModel('Cab') private cabModel : Model<cabDocument>,
    private readonly httpService: HttpService) { }

  async getHello() {
    return { data: 'welcome to cab-booking app' };
  }

  async nearbyCabs(nearbyCabDto: NearbyCabDto): Promise<NearbyCabRo[]> {
    //Aggregation pipeline to get bearby cabs based on the lat-lng from req body
    const pipeline: any = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [nearbyCabDto.longitude, nearbyCabDto.latitude] },
          distanceField: 'distance',
          maxDistance: nearbyCabDto.distance,
          query: { status: CAB_STATUS.AVAILABLE },
          spherical: true,
          isActive: true
        },
      },
    ]
    
    const result : any[] = await this.cabModel.aggregate(pipeline);

    const cabList: NearbyCabRo[] = [];
    //Getting only lat-long and other required values from the result   
    for (let i = 0; i < result.length; i++) {
      const record: NearbyCabRo = {
        cabId: result[i]._id,
        latitude: result[i].location.coordinates[1],
        longitude: result[i].location.coordinates[0],
        distance: result[i].distance,
        title: result[i].title,
        driverName: result[i].driverName,
        contact: result[i].contact
      }
      cabList.push(record);
    }

    return cabList;
  }

  async bookCab(bookingReq: BookingReqDto, userId: string): Promise<string> {
    const cab = await this.cabModel.findById(bookingReq.cabId); 

    //Check id cab is AVAILABLE to accept the booking request
    if (cab.status != CAB_STATUS.AVAILABLE) {
      throw new BadRequestException('cab is not in AVAILABLE to accept the booking request');
    }

    const pickup = this.GetGeoLocation(bookingReq.pickup.latitude, bookingReq.pickup.longitude);
    const drop = this.GetGeoLocation(bookingReq.drop.latitude, bookingReq.drop.longitude)

    const recordTobeAdded = {
      userId: userId,
      cabId: bookingReq.cabId,
      bookingAt: new Date(),
      drop: drop,
      pickup: pickup,
      bookingStatus: BOOKING_STATUS.PENDING
    }

    const bookingRecord = new this.bookingModel(recordTobeAdded);
    const sendBooking = await bookingRecord.save();

    return sendBooking._id;
  }

  async pastBookings(userId: string, pageNumber, pageSize = 3): Promise<BookingRo[]> {
    //aggregation pipeline with all stages to get user's past bokkings 
    const pipeline: any = [
      {
        $match: {
          $and: [
            { "userId": userId, },
            { "bookingStatus": BOOKING_STATUS.COMPLETED }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          bookingAt: 1,
          cabId: { $toObjectId: '$cabId' },
          pickup: 1,
          drop: 1
        }
      },

      {
        $lookup: {
          from: 'cabs',
          localField: 'cabId',
          pipeline: [
            {
              $project:
                { _id: 1, driverName: 1, contact: 1, title: 1 }
            }
          ],
          foreignField: '_id',
          as: 'cabDetails',
        },
      },
      {
        $unwind: "$cabDetails"
      },
      {
        $project: { "cabId": 0 }
      }
      , {
        $skip: (pageNumber - 1) * pageSize
      },
      {
        $limit: pageSize
      }
    ]

    const bookingData: BookingRo[] = await this.bookingModel.aggregate(pipeline);
    return bookingData;
  }

  //To Map lat-lng In geoLocation format to save in MongoDb Collection
  GetGeoLocation(lat: number, lng: number) {
    const geoLocation = {
      type: 'Point',
      coordinates: [+lng, +lat],
    };
    return geoLocation;
  }
}


