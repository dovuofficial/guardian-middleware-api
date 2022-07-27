import onlyPost from '@lib/middleware/onlyPost'
import prepare from '@lib/utils/prepare'
import CreateAccountHandler from '@lib/handler/accounts/createAccountHandler'
import useGuardianContext from '@lib/context/useGuardianContext'
import useHashgraphContext from '@lib/context/useHashgraphContext'

export default prepare(
	onlyPost,
	useGuardianContext,
	useHashgraphContext
)(CreateAccountHandler)
