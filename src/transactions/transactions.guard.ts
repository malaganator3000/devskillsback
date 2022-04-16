import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { Observable } from 'rxjs';
import {
	CreateTransactionDto,
	CreateTransactionDtoPaymentMethod,
} from './dto/create-transaction.dto';

@Injectable()
export class TransactionsGuardCreate implements CanActivate {
	async canActivate(context: ExecutionContext) {
		try {
			const request = context.switchToHttp().getRequest();
			const body = request.body;

			if (!body) {
				throw new BadRequestException(`Body required`);
			}
			Logger.log(body);

			const create = new CreateTransactionDto();
			create.paymentAmount = body.paymentAmount;
			create.barCode = body.barCode;
			create.paymentDate = body.paymentDate;

			const paymentMethod = new CreateTransactionDtoPaymentMethod();
			paymentMethod.type = body.paymentMethod?.type;

			paymentMethod.card_number = body.paymentMethod?.card_number;
			paymentMethod.exp_month = body.paymentMethod?.exp_month;
			paymentMethod.exp_year = body.paymentMethod?.exp_year;
			paymentMethod.holdername = body.paymentMethod?.holdername;

			const errors_payments = await validate(paymentMethod);

			if (errors_payments.length > 0) {
				throw new BadRequestException(
					errors_payments.map((n) => ({
						[n.property]: n.constraints,
					})),
				);
			}

			create.paymentMethod = paymentMethod;

			const errors = await validate(create);

			if (errors.length > 0) {
				throw new BadRequestException(
					errors.map((n) => ({ [n.property]: n.constraints })),
				);
			}
			return true;
		} catch (error) {
			Logger.error(error);
			throw error;
		}
	}
}
