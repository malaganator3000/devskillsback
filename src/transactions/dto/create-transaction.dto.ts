import { PaymentMethodType } from "src/payment-methods/entities/payment-method.entity";



export class CreateTransactionDto {
    paymentAmount: number;
    barCode:string;
    paymentDate?:Date;
    paymentMethod:{
        type:PaymentMethodType;
        card_number?:string;
        exp_month?: string;
        exp_year?: string;
        holdername?: string;
    }
}
