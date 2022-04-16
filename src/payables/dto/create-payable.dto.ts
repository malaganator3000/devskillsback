import { ServicePayable } from '../entities/payable.entity';

export class CreatePayableDto {
	serviceAmount: number;
	dueDate: Date;
	service: ServicePayable;
	description?: string;
}
