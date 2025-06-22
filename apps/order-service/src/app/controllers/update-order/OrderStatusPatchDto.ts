import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class OrderStatusPatchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;
}
