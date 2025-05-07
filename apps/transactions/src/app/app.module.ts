import { Module } from '@nestjs/common';
import { TransactionController } from './api/Transaction.controller';
import { DatabaseRepository } from './infraestructure/repositories/Database.repository';
import { KafkaService } from './application/services/Kafka.service';
import { TransactionService } from './application/services/Transaction.service';
import { PrismaService } from './infraestructure/services/prisma.service';
import { KafkaRepository } from './infraestructure/repositories/Kafka.repository';
import { TRANSACTION_SERVICE } from './domain/services/ITransaction.service';
import { KafkaConsumerService } from './application/services/KafkaConsumer.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    DatabaseRepository,
    KafkaService,
    TransactionService,
    PrismaService,
    KafkaRepository,
    {
      provide: 'KAFKA_CONFIG',
      useValue: {
        server: 'localhost:9092',
        topic: 'transactions-validation',
        topicUpdate: 'transactions-update',
        groupId: 'transactions-group',
      },
    },
    KafkaConsumerService,
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
})
export class AppModule {}
