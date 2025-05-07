import { Injectable } from '@nestjs/common';
import { ITransactionService } from '../../domain/services/ITransaction.service';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionGetRequest } from '../dtos/TransactionRequest.dto';
import { DatabaseRepository } from '../../infraestructure/repositories/Database.repository';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(private readonly databaseRepository: DatabaseRepository) {}

  async createTransaction(transaction: Transaction): Promise<void> {
    await this.databaseRepository.addTransaction(transaction);
  }

  async getTransactionByExternalId(
    request: TransactionGetRequest
  ): Promise<Transaction | null> {
    return this.databaseRepository.getTransactionByExternalId(request);
  }

  async updateTransactionStatus(transaction: Transaction): Promise<void> {
    await this.databaseRepository.updateTransactionStatus(transaction);
  }
}
