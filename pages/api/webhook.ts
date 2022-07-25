import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import ExampleWebhookHandler from '@app/handler/exampleWebhookHandler'
import withHmac from '@app/middleware/withHmac'

export default prepare(onlyPost, withHmac)(ExampleWebhookHandler)
