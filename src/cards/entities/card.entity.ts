import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	IsUUID,
	Model,
	Table,
} from 'sequelize-typescript';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';

export enum CardType {
	CREDIT = 'credit',
	DEBIT = 'debit',
}
@Table({
	timestamps: true,
	tableName: 'cards',
})
export class Card extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column(DataType.STRING)
	card_number: string;

	@Column(DataType.STRING)
	exp_month: string;

	@Column(DataType.STRING)
	exp_year: string;

	@Column(DataType.STRING)
	brand: string;

	@Column(DataType.STRING)
	holdername: string;

	@Column(DataType.ENUM(`credit`, `debit`))
	type: CardType;

	@Column(DataType.STRING)
	idStripe: string;

	@ForeignKey(() => PaymentMethod)
	@Column({ unique: true, })
	idPaymentMethod: number;

	@BelongsTo(() => PaymentMethod)
	paymentMethod: PaymentMethod;
}
