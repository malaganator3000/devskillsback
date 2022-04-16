import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreatePayableDto } from './dto/create-payable.dto';
import { validate } from 'class-validator';
@Injectable()
export class PayablesGuardCreate implements CanActivate {
	async canActivate(context: ExecutionContext) {
		try {
			const request = context.switchToHttp().getRequest();
			const body = request.body;
			if (!body) {
				throw new BadRequestException(`Body required`);
			}
			Logger.log(body);

			const create = new CreatePayableDto();
			create.dueDate = body.dueDate;
			create.service = body.service;
			create.serviceAmount = body.serviceAmount;
			create.description = body.description;
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
