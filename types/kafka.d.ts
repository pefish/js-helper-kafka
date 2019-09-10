import '@pefish/js-node-assist';
import { KafkaClientOptions, ProduceRequest, OffsetFetchRequest, Message } from 'kafka-node';
export default class KafkaHelper {
    private config;
    private producer;
    private client;
    private consumer;
    constructor(config: KafkaClientOptions);
    close(): Promise<void>;
    closeProducer(): Promise<unknown>;
    closeConsumer(): Promise<unknown>;
    initProducer(): Promise<unknown>;
    consume(target: OffsetFetchRequest[], cb: (message: Message) => Promise<void>): Promise<unknown>;
    send(message: ProduceRequest[]): Promise<any>;
}
