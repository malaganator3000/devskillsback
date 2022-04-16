import { IsNotEmpty, ValidateIf } from 'class-validator';
import { PaymentMethodType } from 'src/payment-methods/entities/payment-method.entity';

export class CreateTransactionDtoPaymentMethod {
	@IsNotEmpty({
		message: `type is required`,
	})
	type: PaymentMethodType;
	@ValidateIf((o) => o.type === 'card')
	@IsNotEmpty({
		message: `card_number is required when type == "card"`,
	})
	card_number?: string;
	@ValidateIf((o) => o.type === 'card')
	@IsNotEmpty({
		message: `exp_month is required when type == "card"`,
	})
	exp_month?: string;
	@ValidateIf((o) => o.type === 'card')
	@IsNotEmpty({
		message: `exp_year is required when type == "card"`,
	})
	exp_year?: string;
	@ValidateIf((o) => o.type === 'card')
	@IsNotEmpty({
		message: `holdername is required when type == "card"`,
	})
	holdername?: string;
}
export class CreateTransactionDto {
	@IsNotEmpty({
		message: `paymentAmount is required`,
	})
	paymentAmount: number;
	@IsNotEmpty({
		message: `barCode is required`,
	})
	barCode: string;
	@IsNotEmpty({
		message: `paymentDate is required`,
	})
	paymentDate?: Date;
	@IsNotEmpty({
		message: `serviceAmount is required`,
	})
	paymentMethod: CreateTransactionDtoPaymentMethod;
}
