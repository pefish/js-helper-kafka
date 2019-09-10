import KafkaHelper from "./kafka"

describe('Test', () => {
  let helper: KafkaHelper

  before(async () => {
    helper = new KafkaHelper({
      kafkaHost: `kafka1:9092`,
    })
  })

  it('send', async function () {
    await helper.initProducer()
    await helper.send([
      {
        topic: `test`,
        messages: `haha`,
      }
    ])
  });

  it('consume', async function () {
    await helper.consume([
      {
        topic: `test`,
      }
    ], async (message) => {
      console.log(message)
    })
  });

  after(async () => {
    await helper.close()
  })
})
