import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '주문 접수 (재고 차감 포함)' })
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '전체 주문 목록' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자별 주문 목록' })
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findByUserId(userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '배송 상태 변경 (취소 시 재고 복구)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }
}
