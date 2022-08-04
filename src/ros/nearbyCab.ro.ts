import { ApiProperty } from "@nestjs/swagger";


export class NearbyCabRo {
  @ApiProperty()
    cabId: string;
    @ApiProperty()
    latitude: number;
    @ApiProperty()
    longitude: number;
    @ApiProperty()
    distance : number;
    @ApiProperty()
    title: string;
    @ApiProperty()
    driverName: string;
    @ApiProperty()
    contact: string
  }
