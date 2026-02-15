import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  stock!: number;
}
