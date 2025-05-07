import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/Transaction.entity';
import { KafkaRepository } from '../../infraestructure/repositories/Kafka.repository';
import { MemoryTemporalRepository } from '../../infraestructure/repositories/MemoryTemporal.repository';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly DAYLI_LIMIT = 10000;
  private readonly TRANSACTION_LIMIT = 1000;
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumer: Consumer;

  constructor(
    @Inject('KAFKA_CONFIG')
    private readonly kafkaConfig: {
      server: string;
      topic: string;
      groupId: string;
    },
    private readonly kafkaRepository: KafkaRepository,
    private readonly memoryTemporalRepository: MemoryTemporalRepository
  ) {
    const kafka = new Kafka({
      clientId: 'antifraud-consumer',
      brokers: [this.kafkaConfig.server],
    });
    this.consumer = kafka.consumer({ groupId: this.kafkaConfig.groupId });
  }

  async onModuleInit() {
    await this.startConsumer();
  }

  private async startConsumer() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topics: [this.kafkaConfig.topic],
        fromBeginning: true,
      });
      this.logger.log(
        `Kafka consumer started listening on ${this.kafkaConfig.topic}`
      );

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const transaction: Transaction = JSON.parse(
              message.value.toString()
            );

            if (!transaction) {
              this.logger.warn(`Received null transaction`);
              return;
            }

            await this.validateTransaction(transaction);
          } catch (error) {
            this.logger.error(`Error processing message: ${error.message}`);
          }
        },
      });
    } catch (error) {
      this.logger.error(`Error starting consumer: ${error.message}`);
      setTimeout(() => this.startConsumer(), 5000);
    }
  }

  private async validateTransaction(transaction: Transaction) {
    const amountTotalDay =
      await this.memoryTemporalRepository.getAmountValueBySourceAccount(
        transaction.sourceAccountId,
        transaction.createdAt
      );
    transaction = this.validateStatus(amountTotalDay, transaction);
    await this.memoryTemporalRepository.addTransaction(transaction);
    await this.kafkaRepository.sendMessageAsync(
      transaction.id,
      JSON.stringify(transaction)
    );

    this.logger.log(
      `Transaction ${transaction.id} processed with status: ${transaction.status}`
    );
  }

  private validateStatus(
    amountTotalDay: number,
    transaction: Transaction
  ): Transaction {
    if (transaction.value + amountTotalDay > this.DAYLI_LIMIT) {
      transaction.status = TransactionStatus.REJECTED;
    } else {
      transaction.status =
        transaction.value > this.TRANSACTION_LIMIT
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED;
    }
    return transaction;
  }
}
