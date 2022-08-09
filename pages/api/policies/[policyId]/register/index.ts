import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import registerProjectHandler from 'src/handler/policies/registerProjectHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config'

export default prepare(
	onlyPost,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.REGISTRANT)
)(registerProjectHandler)
