import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import registerProjectHandler from 'src/handler/policies/registerProjectHandler'
import withAuthentication from 'src/middleware/withAuthentication'

export default prepare(
	onlyPost,
	useGuardianContext,
	withAuthentication
)(registerProjectHandler)
