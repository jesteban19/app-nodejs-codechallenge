import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './application/services/KafkaConsumer.service';
import { KafkaRepository } from './infraestructure/repositories/Kafka.repository';
import { MemoryTemporalRepository } from './infraestructure/repositories/MemoryTemporal.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: 'KAFKA_CONFIG',
      useValue: {
        server: 'localhost:9092',
        topic: 'transactions-validation',
        topicUpdate: 'transactions-update',
        groupId: 'transactions-antifraud-group',
      },
    },
    KafkaConsumerService,
    KafkaRepository,
    MemoryTemporalRepository,
  ],
})
export class AppModule {}
