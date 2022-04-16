import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	IsUUID,
	Model,
	Table,
} from 'sequelize-typescript';
import { Payable } from 'src/payables/entities/payable.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
@Table({
	timestamps: true,
	tableName: 'transactions',
})
export class Transaction extends Model {

	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column(DataType.FLOAT)
	paymentAmount: number;

	@Column(DataType.FLOAT)
	total: number;

	@Column(DataType.DATE)
	paymentDate: Date;

	@ForeignKey(() => Payable)
    @Column({
		type:DataType.UUID,
		unique:true,
		
	})
	barCode:string

	@BelongsTo(() => Payable)
	payable: Payable;


	@ForeignKey(() => PaymentMethod)
    @Column
	idPaymentMethod:number

	@BelongsTo(() => PaymentMethod)
	paymentMethod: PaymentMethod;
}
