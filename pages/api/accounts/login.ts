import prepare from 'src/utils/prepare'
import loginHandler from 'src/handler/accounts/loginHandler'
import useGuardianContext from 'src/context/useGuardianContext'
import onlyPost from 'src/middleware/onlyPost'
import withHmac from 'src/middleware/withHmac'

export default prepare(onlyPost, withHmac, useGuardianContext)(loginHandler)
