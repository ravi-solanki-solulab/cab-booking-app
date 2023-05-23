import { ApiProperty } from '@nestjs/swagger';

export class NearbyCabDto {
  @ApiProperty()
  distance: number; // in meter unit
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
}
