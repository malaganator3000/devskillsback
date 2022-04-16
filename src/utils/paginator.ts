import { Logger } from '@nestjs/common';
import {
	Column,
	DataType,
	HasOne,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
	ModelCtor,
} from 'sequelize-typescript';
import {
	Includeable,
	IncludeOptions,
	Order,
	WhereOptions,
} from 'sequelize/types';

export class Paginator<T extends Model<T>> {
	private limit: number;
	private offset: number;
	private where: WhereOptions;
	private attributes: string[];
	private order: Order;
	private include: Includeable[];
	constructor(protected model: ModelCtor<T>) {
		this.order = [['createdAt', 'DESC']];
	}

	setSize(size: number) {
		this.limit = size ? +size : 10;
		return this;
	}

	setPage(page: number) {
		this.offset = page ? (+page - 1) * this.limit : 0;
		return this;
	}

	setWhere(where: WhereOptions) {
		this.where = where;
		return this;
	}

	setAttributes(attributes: string[]) {
		this.attributes = attributes;
		return this;
	}

	setOrder(order: Order) {
		this.order = order ? order : [['createdAt', 'DESC']];
		return this;
	}

	setInclude(include: IncludeOptions[]) {
		this.include = include;
		return this;
	}

	async calculate() {
		const { limit, offset, where, attributes, order, model, include } =
			this;
		const filter = new Map();

		if (limit) {
			filter.set('limit', limit);
		}

		if (offset) {
			filter.set('offset', offset);
		}

		if (where) {
			filter.set('where', where);
		}

		if (attributes) {
			filter.set('attributes', attributes);
		}

		if (order) {
			filter.set('order', order);
		}

		if (include) {
			filter.set('include', include);
		}

		const options = {};
		for (const [key, value] of filter.entries()) {
			Object.assign(options, { [key]: value });
		}

		const { count, rows: items } = await model.findAndCountAll(options);
		const pages = Math.ceil(count / limit);
		return { items, pages };
	}
}
