import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './entities/card.entity';

@Module({
	imports: [SequelizeModule.forFeature([Card])],
	controllers: [],
	providers: [],
})
export class CardsModule {}
