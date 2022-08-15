import prepare from 'src/utils/prepare'
import TestAuthHandler from 'src/handler/testAuthHandler'
import withHmac from 'src/middleware/withHmac'
import exceptionFilter from 'src/middleware/exceptionFilter'

export default prepare(exceptionFilter, withHmac)(TestAuthHandler)
