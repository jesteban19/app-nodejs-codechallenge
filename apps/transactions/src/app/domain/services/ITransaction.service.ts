import { TransactionGetRequest } from '../../application/dtos/TransactionRequest.dto';
import { Transaction } from '../entities/transaction.entity';

export const TRANSACTION_SERVICE = 'TRANSACTION_SERVICE';

export interface ITransactionService {
  createTransaction(transaction: Transaction): Promise<void>;
  getTransactionByExternalId(
    request: TransactionGetRequest
  ): Promise<Transaction | null>;
  updateTransactionStatus(transaction: Transaction): Promise<void>;
}
