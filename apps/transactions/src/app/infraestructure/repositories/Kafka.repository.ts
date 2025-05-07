import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Logger } from '@nestjs/common';

@Injectable()
export class KafkaRepository {
  private producer: Producer;
  private readonly logger = new Logger(KafkaRepository.name);

  constructor(
    @Inject('KAFKA_CONFIG')
    private readonly kafkaConfig: {
      server: string;
      topic: string;
    }
  ) {
    const kafka = new Kafka({
      clientId: 'transactions-service',
      brokers: [this.kafkaConfig.server],
    });
    this.producer = kafka.producer();
  }

  async sendMessageAsync(key: string, message: string): Promise<void> {
    await this.producer.connect();

    try {
      this.logger.log(`Sending message to topic: ${this.kafkaConfig.topic}`);
      await this.producer.send({
        topic: this.kafkaConfig.topic,
        messages: [
          {
            key,
            value: message,
          },
        ],
      });
    } finally {
      await this.producer.disconnect();
    }
  }
}
