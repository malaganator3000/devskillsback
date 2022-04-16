import { Injectable } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import {
	Includeable,
	IncludeOptions,
	Order,
	WhereOptions,
} from 'sequelize/types';
import { Paginator } from './paginator';
@Injectable()
export class UtilsService {
	async paginator<T extends Model<T>>(
		model: ModelCtor<T>,
		size: number,
		page: number,
		where?: WhereOptions,
		attributes?: string[],
		order?: Order,
		include?: IncludeOptions[],
	) {
		const paginator = new Paginator<Model>(model);

		return await paginator
			.setSize(size)
			.setPage(page)
			.setWhere(where)
			.setAttributes(attributes)
			.setOrder(order)
			.setInclude(include)
			.calculate();
	}

	validDates(date: Date, date2: Date) {
		const time1 = date.getTime();
		const time2 = date2.getTime();

		return time1 < time2 || time1 == time2;
	}
}
