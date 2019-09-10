import '@pefish/js-node-assist'
import { Producer, KafkaClientOptions, ProduceRequest, KafkaClient, Consumer, OffsetFetchRequest, Message } from 'kafka-node'
import ErrorHelper from '@pefish/js-error'

export default class KafkaHelper {
  private config: KafkaClientOptions
  private producer: Producer
  private client: KafkaClient
  private consumer: Consumer

  constructor(config: KafkaClientOptions) {
    this.config = config
    this.client = new KafkaClient(this.config)
  }

  async close () {
    await this.closeProducer()
    await this.closeConsumer()
  }

  async closeProducer () {
    return new Promise((resolve, reject) => {
      if (this.producer) {
        this.producer.close(() => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  async closeConsumer () {
    return new Promise((resolve, reject) => {
      if (this.consumer) {
        this.consumer.close(true, (err) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  async initProducer() {
    global.logger.debug(`initProducer...`)
    return new Promise((resolve, reject) => {
      const producer = new Producer(this.client);
      producer.on('ready', () => {
        this.producer = producer
        global.logger.debug(`initProducer succeed!!!`)
        resolve()
      })
      producer.on('error', (err) => {
        reject(err)
      })
    })
  }

  async consume(target: OffsetFetchRequest[], cb: (message: Message) => Promise<void>) {
    return new Promise((resolve, reject) => {
      this.consumer = new Consumer(
        this.client,
        target,
        {
          autoCommit: true
        }
      );
      this.consumer.on('message', cb);
      this.consumer.on('error', (err) => {
        reject(err)
      });
      this.consumer.on('offsetOutOfRange', (err) => {
        reject(err)
      });
    })
  }

  async send (message: ProduceRequest[]): Promise<any> {
    if (!this.producer) {
      throw new ErrorHelper(`init producer first`)
    }
    return new Promise((resolve, reject) => {
      this.producer.send(message, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        global.logger.debug(`send message: ${JSON.stringify(message)}`)
        resolve(data)
      });
    })
  }
}
