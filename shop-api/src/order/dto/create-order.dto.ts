import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: '상품 ID' })
  @IsNumber()
  productId!: number;

  @ApiProperty({ example: 1, description: '사용자 ID (DevQuest 서버의 member ID)' })
  @IsNumber()
  userId!: number;

  @ApiPropertyOptional({ example: 1, description: '수량 (기본값 1)' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;
}
