import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentMethod } from './entities/payment-method.entity';

@Module({
	imports: [SequelizeModule.forFeature([PaymentMethod])],
	controllers: [],
	providers: [],
})
export class PaymentMethodsModule {}
