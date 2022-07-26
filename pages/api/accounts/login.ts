import prepare from 'lib/utils/prepare'
import loginHandler from 'lib/handler/accounts/loginHandler'
import useGuardianContext from 'lib/context/useGuardianContext'
import onlyPost from 'lib/middleware/onlyPost'

export default prepare(onlyPost, useGuardianContext)(loginHandler)
