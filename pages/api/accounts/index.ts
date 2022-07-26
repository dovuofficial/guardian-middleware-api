import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import CreateAccountHandler from '@app/handler/accounts/createAccountHandler'
import useGuardianContext from '@app/context/useGuardianContext'

export default prepare(onlyPost, useGuardianContext)(CreateAccountHandler)
