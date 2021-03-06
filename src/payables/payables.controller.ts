import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PayablesService } from './payables.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { ReadAllPayableDto } from './dto/readAll-payable.dto';
import { PayablesGuardCreate } from './payables.guard';

@Controller('payables')
export class PayablesController {
  constructor(private readonly payablesService: PayablesService) {}

  @UseGuards(PayablesGuardCreate)
  @Post()
  async create(@Body() createPayableDto: CreatePayableDto) {
    return await this.payablesService.create(createPayableDto);
  }

  @Get()
  async findAll(@Query() query:ReadAllPayableDto) {
    return await this.payablesService.findAll(query);
  }

}
