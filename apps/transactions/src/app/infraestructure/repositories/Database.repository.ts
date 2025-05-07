import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { TransactionGetRequest } from '../../application/dtos/TransactionRequest.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class DatabaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addTransaction(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        sourceAccountId: transaction.sourceAccountId,
        targetAccountId: transaction.targetAccountId,
        transferTypeId: transaction.transferTypeId,
        value: transaction.value,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    });
  }

  async getTransactionByExternalId(
    request: TransactionGetRequest
  ): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: request.externalId,
        createdAt: {
          gte: new Date(request.createdAt),
          lt: new Date(
            new Date(request.createdAt).setDate(
              new Date(request.createdAt).getDate() + 1
            )
          ),
        },
      },
    });

    if (!transaction) {
      return null;
    }

    return {
      id: transaction.id,
      sourceAccountId: transaction.sourceAccountId,
      targetAccountId: transaction.targetAccountId,
      transferTypeId: transaction.transferTypeId,
      value: transaction.value,
      status: transaction.status as TransactionStatus,
      createdAt: transaction.createdAt,
    };
  }

  async updateTransactionStatus(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        status: transaction.status,
      },
    });
  }
}
