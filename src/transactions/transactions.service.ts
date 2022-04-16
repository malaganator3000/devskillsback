import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Op } from 'sequelize';
import { Card, CardType } from 'src/cards/entities/card.entity';
import { Payable, StatusPayable } from 'src/payables/entities/payable.entity';
import {
	PaymentMethod,
	PaymentMethodType,
} from 'src/payment-methods/entities/payment-method.entity';
import { UtilsService } from 'src/utils/utils.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReadAllTransactionDto } from './dto/readAll-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
	constructor(private utilService: UtilsService) {}

	async create(createTransactionDto: CreateTransactionDto) {
		const sequelizeInstance = Payable.sequelize;
		const transaction = await sequelizeInstance.transaction();
		try {
			const payable = await Payable.findByPk(
				createTransactionDto.barCode,
			);

			if (!payable) {
				throw new BadRequestException(
					`No payable was found with ${createTransactionDto.barCode}.`,
				);
			}

			if (payable.status == StatusPayable.PAID) {
				throw new BadRequestException(
					`Payable is paid`,
				);
			}
			let transactionDb: Transaction;
			let paymentMethod: PaymentMethod;
			let card: Card;
			if (
				createTransactionDto.paymentMethod.type ==
				PaymentMethodType.CASH
			) {
				paymentMethod = await PaymentMethod.create(
					{
						type: PaymentMethodType.CASH,
					},
					{ transaction },
				);

				transactionDb = await Transaction.create(
					{
						...createTransactionDto,
						total:
							createTransactionDto.paymentAmount +
							payable.serviceAmount,
						idPaymentMethod: paymentMethod.id,
					},
					{ transaction },
				);
			}

			if (
				createTransactionDto.paymentMethod.type ==
				PaymentMethodType.CARD
			) {
				paymentMethod = await PaymentMethod.create(
					{
						type: PaymentMethodType.CARD,
					},
					{ transaction },
				);

				card = await Card.create(
					{
						...createTransactionDto.paymentMethod,
						type: CardType.CREDIT,
						idPaymentMethod: paymentMethod.id,
					},
					{ transaction },
				);

				transactionDb = await Transaction.create(
					{
						...createTransactionDto,
						total:
							createTransactionDto.paymentAmount +
							payable.serviceAmount,
						idPaymentMethod: paymentMethod.id,
					},
					{ transaction },
				);

				await Payable.update(
					{
						status: StatusPayable.PAID,
					},
					{ where: { barCode: payable.barCode }, transaction },
				);
			}

			if (
				createTransactionDto.paymentMethod.type ==
				PaymentMethodType.STORE
			) {
				throw 'Payment Method no aviable.';
			}
			await transaction.commit();
			return transactionDb;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async findAll(query: ReadAllTransactionDto) {
		const { size, page, start_date, end_date } = query;
		let startDate = new Date(start_date);
		let endDate = new Date(end_date);
		const where = {};

		if (start_date && end_date) {
			if (this.utilService.validDates(startDate, endDate)) {
				startDate = new Date(start_date);
				endDate = new Date(end_date);
				Object.assign(where, {
					paymentDate: {
						[Op.between]: [startDate, endDate],
					},
				});
			}
		}

		const response = await Transaction.findAll({
			where,
			attributes: [
				'id',
				'paymentAmount',
				'total',
				'paymentDate',
				'barCode',
			],
			order: [['paymentDate', 'DESC']],
			include: [
				{
					model: PaymentMethod,
					as: 'paymentMethod',
					attributes: ['type'],
					include: [
						{
							model: Card,
							as: 'card',
							attributes: [
								'card_number',
								'exp_month',
								'exp_year',
								'brand',
								'holdername',
								'type',
							],

							required: false,
						},
					],
				},
			],
		});

		const groupBy = function (items: any[], key: string) {
			const raw = items.reduce(function (acc, item) {
				(acc[item[key].toISOString()] =
					acc[item[key].toISOString()] || []).push(item);
				return acc;
			}, {});

			return Object.entries(raw).map(([key, value]) => {
				const transactions = value as Transaction[];
				return {
					[key]: {
						totalAmount: transactions.reduce(
							(acc, item) => acc + item.total,
							0,
						),
						totalTransactions: transactions.length,
					},
				};
			});
		};

		return {
			items: groupBy(response, 'paymentDate'),
		};
	}
}
