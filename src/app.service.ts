import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
//import { User, userDocument } from './schemas/user.schema';
import { Connection, isObjectIdOrHexString, Model } from "mongoose";
import { UserDto } from './dtos/user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, ObjectUnsubscribedError, tap } from 'rxjs';
import { response } from 'express';
import { BookingRo } from './ros/bookin.ro';
import { NearbyCabDto } from './dtos/nearby.dto';
import { NearbyCabRo } from './ros/nearbyCab.ro';
import { JwtService } from '@nestjs/jwt';
import { BookingReqDto } from './dtos/booking.dto';
import { ObjectId } from 'mongodb';
import { BOOKING_STATUS, CAB_STATUS, COLLECTION_NAMES } from './constants/status';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private connection: Connection,
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
    const result: any[] = await this.connection.db.collection(COLLECTION_NAMES.CABS).aggregate(pipeline).toArray();

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
    const cab = await this.connection.db.collection(COLLECTION_NAMES.CABS).findOne({ _id: new ObjectId(bookingReq.cabId) });

    //Check id cab is AVAILABLE to accept the booking request
    if (cab.status != CAB_STATUS.AVAILABLE) {
      throw new BadRequestException('cab is not in AVAILABLE to accept the booking request');
    }

    const pickup = this.GetGeoLocation(bookingReq.pickup.latitude, bookingReq.pickup.longitude);
    const drop = this.GetGeoLocation(bookingReq.drop.latitude, bookingReq.drop.longitude)

    //Inserting booking request in 'bookinga' collection
    const sendBooking = await this.connection.db.collection(COLLECTION_NAMES.BOOKINGS).insertOne({
      userId: userId,
      cabId: bookingReq.cabId,
      bookingAt: new Date(),
      drop: drop,
      pickup: pickup,
      bookingStatus: BOOKING_STATUS.PENDING
    })

    return sendBooking.insertedId.toString();
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

    const bookingData: BookingRo[] = await this.connection.db.collection(COLLECTION_NAMES.BOOKINGS).aggregate(pipeline).toArray();

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


