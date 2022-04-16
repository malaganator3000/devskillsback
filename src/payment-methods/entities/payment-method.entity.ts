import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	HasOne,
	IsUUID,
	Model,
	Table,
} from 'sequelize-typescript';
import { Card } from 'src/cards/entities/card.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';


export enum PaymentMethodType{
    CARD="card",
    CASH="cash",
    STORE="store"
    
}
@Table({
	timestamps: true,
	tableName: 'payment_methods',
})
export class PaymentMethod extends Model{
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

    @Column({
		type: DataType.ENUM(`card`, `cash`, `store`),
		defaultValue: `cash`,
	})
	type: PaymentMethodType;

    @HasMany(()=>Transaction,'idPaymentMethod')
    transactions:Transaction[]

    @HasOne(()=>Card,'idPaymentMethod')
    card:Card
}
