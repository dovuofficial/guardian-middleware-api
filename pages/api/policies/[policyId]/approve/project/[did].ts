import onlyPut from 'src/middleware/onlyPut'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import approveEcologicalProjectHandler from 'src/handler/policies/approveEcologicalProjectHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config'

export default prepare(
	onlyPut,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.STANDARD_REGISTRY)
)(approveEcologicalProjectHandler)
