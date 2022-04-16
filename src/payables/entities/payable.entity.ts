import {
	Column,
	DataType,
	HasOne,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';

import { Transaction } from 'src/transactions/entities/transaction.entity';

export enum StatusPayable {
	PENDING = 'pending',
	PAID = 'paid',
	FAIL = 'fail',
}

export enum ServicePayable {
	GAS = 'gas',
	ELECTRIC_ENERGY = 'energy',
	INTERNET = 'internet',
	WATER = 'water',
}
@Table({
	timestamps: true,
	tableName: 'payables',
})
export class Payable extends Model {
	@Column({
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
		type: DataType.UUID,
	})
	barCode: string;

	@Column({
		type: DataType.ENUM(`pending`, `paid`, `fail`),
		defaultValue: `pending`,
	})
	status?: StatusPayable;

	@Column({
		type: DataType.ENUM(`gas`, `energy`, `internet`, `water`),
	})
	service: ServicePayable;

	@Column(DataType.TEXT)
	description?: string;

	@Column(DataType.DATE)
	dueDate: Date;

	@Column(DataType.FLOAT)
	serviceAmount: number;

	@HasOne(() => Transaction, 'barCode')
	transaction: Transaction;
}
