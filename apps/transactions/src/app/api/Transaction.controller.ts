import { randomUUID } from 'crypto';
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import {
  ITransactionService,
  TRANSACTION_SERVICE,
} from '../domain/services/ITransaction.service';
import {
  Transaction,
  TransactionStatus,
} from '../domain/entities/transaction.entity';
import { KafkaService } from '../application/services/Kafka.service';
import {
  TransactionGetRequest,
  TransactionRequest,
} from '../application/dtos/TransactionRequest.dto';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    private readonly kafkaService: KafkaService
  ) {}

  @Post()
  async createTransaction(@Body() request: TransactionRequest) {
    const transaction: Transaction = {
      id: randomUUID(),
      sourceAccountId: request.sourceAccountId,
      targetAccountId: request.targetAccountId,
      transferTypeId: request.transferTypeId,
      value: request.value,
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
    };

    await this.transactionService.createTransaction(transaction);
    await this.kafkaService.sendMessage(
      'transactionExternalId',
      JSON.stringify(transaction)
    );

    return { id: transaction.id };
  }

  @Get()
  async getTransaction(@Query() request: TransactionGetRequest) {
    const transaction =
      await this.transactionService.getTransactionByExternalId(request);

    if (!transaction) {
      throw new NotFoundException();
    }

    return transaction;
  }
}
