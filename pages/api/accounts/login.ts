import prepare from '@app/utils/prepare'
import loginHandler from '@app/handler/accounts/loginHandler'
import useGuardianContext from '@app/context/useGuardianContext'
import onlyPost from '@app/middleware/onlyPost'

export default prepare(onlyPost, useGuardianContext)(loginHandler)
