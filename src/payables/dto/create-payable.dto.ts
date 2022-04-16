import { ServicePayable } from '../entities/payable.entity';
import { ValidateIf, IsNotEmpty } from 'class-validator';

export class CreatePayableDto {
	@IsNotEmpty({
		message:`serviceAmount is required`
	})
	serviceAmount: number;
	@IsNotEmpty({
		message:`dueDate is required`
	})
	dueDate: Date;
	@IsNotEmpty({
		message:`service is required`
	})
	service: ServicePayable;

	description?: string;
}
