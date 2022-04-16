import { Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { ReadAllPayableDto } from './dto/readAll-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { Payable } from './entities/payable.entity';

@Injectable()
export class PayablesService {
	constructor(private utilService: UtilsService) {}

	async create(createPayableDto: CreatePayableDto) {
		const payable = await Payable.create({
			...createPayableDto,
		});

		return payable;
	}

	async findAll(query: ReadAllPayableDto) {
		const { size, page, service } = query;

		const where = service
			? {
					service,
			  }
			: {};

		const attributes = [
			'barCode',
			'status',
			'dueDate',
			'serviceAmount',
			'description',
		];

		if (!service) {
			attributes.push('service');
		}

		 const {items,pages} =await this.utilService.paginator<Payable>(
			Payable,
			+size,
			+page,
			where,
			attributes,
		);

		return {items,pages}
	}
}
