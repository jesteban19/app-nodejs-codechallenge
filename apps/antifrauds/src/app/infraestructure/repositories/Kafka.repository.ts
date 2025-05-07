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
      topicUpdate: string;
    }
  ) {
    const kafka = new Kafka({
      clientId: 'antifraud-service',
      brokers: [this.kafkaConfig.server],
    });
    this.producer = kafka.producer();
  }

  async sendMessageAsync(key: string, message: string): Promise<void> {
    await this.producer.connect();

    try {
      const result = await this.producer.send({
        topic: this.kafkaConfig.topicUpdate,
        messages: [
          {
            key,
            value: message,
          },
        ],
      });
      this.logger.log(
        `Message sent successfully to topic: ${this.kafkaConfig.topicUpdate}`
      );
    } finally {
      await this.producer.disconnect();
    }
  }
}
