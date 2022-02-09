import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';

export interface IFeeTransactionId {
  id?: number;
  transactionId?: string | null;
  feeTransaction?: IFeeTransaction | null;
}

export class FeeTransactionId implements IFeeTransactionId {
  constructor(public id?: number, public transactionId?: string | null, public feeTransaction?: IFeeTransaction | null) {}
}

export function getFeeTransactionIdIdentifier(feeTransactionId: IFeeTransactionId): number | undefined {
  return feeTransactionId.id;
}
