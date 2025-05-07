import { TransactionStatus } from '../../domain/Transaction.entity';
import { Transaction } from '../../domain/Transaction.entity';

export class MemoryTemporalRepository {
  private static transactions: Transaction[] = [];

  async addTransaction(transaction: Transaction): Promise<void> {
    MemoryTemporalRepository.transactions.push(transaction);
  }

  async getAmountValueBySourceAccount(
    sourceAccountId: string,
    createdAt: Date
  ): Promise<number> {
    return MemoryTemporalRepository.transactions
      .filter(
        (transaction) =>
          transaction.sourceAccountId === sourceAccountId &&
          new Date(transaction.createdAt).getDate() ===
            new Date(createdAt).getDate() &&
          transaction.status === TransactionStatus.APPROVED
      )
      .reduce((sum, transaction) => sum + transaction.value, 0);
  }
}
