import prepare from 'src/utils/prepare'
import loginHandler from 'src/handler/accounts/loginHandler'
import useGuardianContext from 'src/context/useGuardianContext'
import onlyPost from 'src/middleware/onlyPost'

export default prepare(onlyPost, useGuardianContext)(loginHandler)
