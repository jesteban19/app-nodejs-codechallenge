import {
  Injectable,
  Logger,
  OnModuleInit,
  Inject,
  OnModuleDestroy,
} from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { Transaction } from '../../domain/entities/transaction.entity';
import {
  ITransactionService,
  TRANSACTION_SERVICE,
} from '../../domain/services/ITransaction.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumer: Consumer;
  private isConnected = false;

  constructor(
    @Inject('KAFKA_CONFIG')
    private readonly kafkaConfig: {
      server: string;
      topicUpdate: string;
      groupId: string;
    },
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService
  ) {
    const kafka = new Kafka({
      clientId: 'transactions-consumer',
      brokers: [this.kafkaConfig.server],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.consumer = kafka.consumer({
      groupId: this.kafkaConfig.groupId,
      maxWaitTimeInMs: 5000,
      sessionTimeout: 30000,
    });
  }

  async onModuleInit() {
    await this.startConsumer();
  }

  async onModuleDestroy() {
    try {
      if (this.isConnected) {
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Kafka consumer disconnected');
      }
    } catch (error) {
      this.logger.error(`Error disconnecting consumer: ${error.message}`);
    }
  }

  private async startConsumer() {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Kafka consumer connected successfully');

      await this.consumer.subscribe({
        topic: this.kafkaConfig.topicUpdate,
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const transaction: Transaction = JSON.parse(
              message.value.toString()
            );

            if (!transaction) {
              this.logger.warn('Received null transaction');
              return;
            }

            await this.validateTransaction(transaction);
          } catch (error) {
            this.logger.error(
              `Error processing message: ${error.message}`,
              error.stack
            );
          }
        },
      });

      this.logger.log(
        `Consumer listening on topic: ${this.kafkaConfig.topicUpdate}`
      );
    } catch (error) {
      this.isConnected = false;
      this.logger.error(
        `Error starting consumer: ${error.message}`,
        error.stack
      );
      setTimeout(() => this.startConsumer(), 5000);
    }
  }

  private async validateTransaction(transaction: Transaction) {
    try {
      await this.transactionService.updateTransactionStatus(transaction);
    } catch (error) {
      this.logger.error(
        `Error updating transaction status: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
