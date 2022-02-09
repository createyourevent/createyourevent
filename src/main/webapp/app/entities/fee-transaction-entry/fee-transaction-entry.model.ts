import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { FeeType } from 'app/entities/enumerations/fee-type.model';

export interface IFeeTransactionEntry {
  id?: number;
  type?: FeeType | null;
  value?: number | null;
  feeTransaction?: IFeeTransaction | null;
}

export class FeeTransactionEntry implements IFeeTransactionEntry {
  constructor(
    public id?: number,
    public type?: FeeType | null,
    public value?: number | null,
    public feeTransaction?: IFeeTransaction | null
  ) {}
}

export function getFeeTransactionEntryIdentifier(feeTransactionEntry: IFeeTransactionEntry): number | undefined {
  return feeTransactionEntry.id;
}
