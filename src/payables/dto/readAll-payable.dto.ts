import { ServicePayable } from '../entities/payable.entity';

export class ReadAllPayableDto {
	page: number;
	size: number;
	service: ServicePayable;
}
