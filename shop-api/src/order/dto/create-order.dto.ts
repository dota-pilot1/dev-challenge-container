import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: '상품 ID' })
  @IsNumber()
  productId!: number;

  @ApiProperty({
    example: 1,
    description: '사용자 ID (DevQuest 서버의 member ID)',
  })
  @IsNumber()
  userId!: number;

  @ApiPropertyOptional({ example: 'terecal3', description: '수상자 닉네임' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ example: 1, description: '수량 (기본값 1)' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({
    example: 'participation-4',
    description: '멱등성 키 (중복 주문 방지)',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
