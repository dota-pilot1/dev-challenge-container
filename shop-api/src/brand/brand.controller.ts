import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { RegisterBrandDto } from './dto/register-brand.dto';

@ApiTags('Platform Brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @ApiOperation({ summary: '플랫폼 브랜드 목록 조회' })
  async findAll() {
    return this.brandService.findAll();
  }

  @Post('register')
  @ApiOperation({ summary: '입점사 브랜드 등록/수정 (단건)' })
  async register(@Body() dto: RegisterBrandDto) {
    return this.brandService.register(dto);
  }

  @Post('register-batch')
  @ApiOperation({ summary: '입점사 브랜드 등록/수정 (일괄)' })
  async registerBatch(@Body() brands: RegisterBrandDto[]) {
    return this.brandService.registerBatch(brands);
  }

  @Delete('all')
  @ApiOperation({ summary: '브랜드 전체 삭제' })
  async deleteAll() {
    return this.brandService.deleteAll();
  }

  @Delete(':brandCode')
  @ApiOperation({ summary: '브랜드 삭제 (brandCode 기준)' })
  async delete(@Param('brandCode') brandCode: string) {
    return this.brandService.deleteByBrandCode(brandCode);
  }
}
