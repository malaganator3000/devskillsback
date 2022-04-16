import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ReadAllTransactionDto } from './dto/readAll-transaction.dto';
import { TransactionsGuardCreate } from './transactions.guard';

@Controller('transactions')
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}
	@UseGuards(TransactionsGuardCreate)
	@Post()
	async create(@Body() createTransactionDto: CreateTransactionDto) {
		return await this.transactionsService.create(createTransactionDto);
	}

	@Get()
	async findAll(@Query() query: ReadAllTransactionDto) {
		return await this.transactionsService.findAll(query);
	}
}
