import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayablesModule } from './payables/payables.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { CardsModule } from './cards/cards.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true,
        dropSchema: true,
        autoLoadModels:true,
        
      }),
      inject: [ConfigService],
    }),
    PayablesModule,
    TransactionsModule,
    PaymentMethodsModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
