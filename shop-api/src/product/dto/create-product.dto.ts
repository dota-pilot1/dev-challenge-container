import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: '스타벅스 아메리카노' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: '따뜻한 아메리카노 톨 사이즈' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 4500 })
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  stock!: number;

  @ApiPropertyOptional({ example: 'https://example.com/americano.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
