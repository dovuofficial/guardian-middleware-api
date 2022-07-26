import onlyPost from 'lib/middleware/onlyPost'
import prepare from 'lib/utils/prepare'
import ExampleWebhookHandler from 'lib/handler/exampleWebhookHandler'
import withHmac from 'lib/middleware/withHmac'

export default prepare(onlyPost, withHmac)(ExampleWebhookHandler)
