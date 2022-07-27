import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import ExampleWebhookHandler from 'src/handler/exampleWebhookHandler'
import withHmac from 'src/middleware/withHmac'

export default prepare(onlyPost, withHmac)(ExampleWebhookHandler)
