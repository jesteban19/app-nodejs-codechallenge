import { Injectable } from '@nestjs/common';
import { KafkaRepository } from '../../infraestructure/repositories/Kafka.repository';

@Injectable()
export class KafkaService {
  constructor(private readonly producer: KafkaRepository) {}

  async sendMessage(key: string, message: string): Promise<void> {
    await this.producer.sendMessageAsync(key, message);
  }
}
