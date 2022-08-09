import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BOOKING_STATUS, CAB_STATUS } from 'src/constants/status';
import { BookingReqDto } from 'src/dtos/booking.dto';
import { NearbyCabDto } from 'src/dtos/nearby.dto';
import { BookingRo } from 'src/ros/bookin.ro';
import { NearbyCabRo } from 'src/ros/nearbyCab.ro';
import { bookingDocument } from 'src/schemas/bookings.shema';
import { cabDocument } from 'src/schemas/cab.schema';

@Injectable()
export class CabService {
    constructor(
        @InjectModel('Booking') private bookingModel: Model<bookingDocument>,
        @InjectModel('Cab') private cabModel: Model<cabDocument>,
    ) { }


    //function to return list nearby cabs
    async nearbyCabs(nearbyCabDto: NearbyCabDto): Promise<NearbyCabRo[]> {
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

        const result: any[] = await this.cabModel.aggregate(pipeline);

        const cabList: NearbyCabRo[] = [];

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

    //function to send booking req to cab
    async bookCab(bookingReq: BookingReqDto, userId: string): Promise<string> {
        const cab = await this.cabModel.findById(bookingReq.cabId);

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

    //function to get list of user's past bookings
    async pastBookings(userId: string, pageNumber, pageSize = 3): Promise<BookingRo[]> {

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

    //function to map lat-lng In geoLocation format to save in MongoDb Collection
    GetGeoLocation(lat: number, lng: number) {
        const geoLocation = {
            type: 'Point',
            coordinates: [+lng, +lat],
        };
        return geoLocation;
    }
}
