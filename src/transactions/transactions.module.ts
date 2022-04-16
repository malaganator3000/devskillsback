import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { TransactionsGuardCreate } from './transactions.guard';

@Module({
	imports: [SequelizeModule.forFeature([Transaction]), UtilsModule],
	controllers: [TransactionsController],
	providers: [TransactionsService,TransactionsGuardCreate],
})
export class TransactionsModule {}
