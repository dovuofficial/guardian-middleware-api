import prepare from 'src/utils/prepare'
import TestAuthHandler from 'src/handler/testAuthHandler'
import withHmac from 'src/middleware/withHmac'

export default prepare(withHmac)(TestAuthHandler)
