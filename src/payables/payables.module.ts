import { Module } from '@nestjs/common';
import { PayablesService } from './payables.service';
import { PayablesController } from './payables.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payable } from './entities/payable.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
	imports: [SequelizeModule.forFeature([Payable]), UtilsModule],
	controllers: [PayablesController],
	providers: [PayablesService],
})
export class PayablesModule {}
