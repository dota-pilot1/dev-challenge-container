import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterBrandDto {
  @ApiProperty({ example: 'BR001' })
  @IsString()
  @IsNotEmpty()
  brandCode!: string;

  @ApiPropertyOptional({ example: 'SHOP001' })
  @IsString()
  @IsOptional()
  shopId?: string;

  @ApiProperty({ example: 'STE001' })
  @IsString()
  @IsNotEmpty()
  brandMid!: string;

  @ApiProperty({ example: '테스트브랜드' })
  @IsString()
  @IsNotEmpty()
  brandNameKo!: string;

  @ApiPropertyOptional({ example: 'Test Brand' })
  @IsString()
  @IsOptional()
  brandNameEn?: string;

  @ApiPropertyOptional({ example: '스포츠 브랜드' })
  @IsString()
  @IsOptional()
  brandDesc?: string;

  @ApiPropertyOptional({ example: 'Y' })
  @IsString()
  @IsOptional()
  useYn?: string;
}
