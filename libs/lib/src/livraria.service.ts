/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices'

@Injectable()
export class LivrariaService {
    constructor(
        private readonly configService: ConfigService
    ){}

    getRmqOptions(queue: string): RmqOptions {
        const Usuario = this.configService.get('RABBITMQ_USER');
        const senha = this.configService.get('RABBITMQ_PASS');
        const PORTA = this.configService.get('RABBITMQ_HOST');
    
        return {
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${Usuario}:${senha}@${PORTA}`],
            noAck: false,
            queue,
            queueOptions: {
              durable: true,
            },
          },
        };
      }
}
