import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import CreateAccountHandler from 'src/handler/accounts/createAccountHandler'
import useGuardianContext from 'src/context/useGuardianContext'
import useHashgraphContext from 'src/context/useHashgraphContext'

export default prepare(
	onlyPost,
	useGuardianContext,
	useHashgraphContext
)(CreateAccountHandler)
