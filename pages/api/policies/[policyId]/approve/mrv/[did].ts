import onlyPut from 'src/middleware/onlyPut'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import approveMrvRequestHandler from 'src/handler/policies/approveMrvRequestHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'
import exceptionFilter from 'src/middleware/exceptionFilter'

export default prepare(
	exceptionFilter,
	onlyPut,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.VERIFIER)
)(approveMrvRequestHandler)
