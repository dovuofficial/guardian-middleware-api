import onlyPost from 'lib/middleware/onlyPost'
import prepare from 'lib/utils/prepare'
import CreateAccountHandler from 'lib/handler/accounts/createAccountHandler'
import useGuardianContext from 'lib/context/useGuardianContext'

export default prepare(onlyPost, useGuardianContext)(CreateAccountHandler)
