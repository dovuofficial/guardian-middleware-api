import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import trustChainsHandler from 'src/handler/policies/trustChainsHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'
import exceptionFilter from 'src/middleware/exceptionFilter'
import onlyGet from 'src/middleware/onlyGet'

export default prepare(
	exceptionFilter,
	onlyGet,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.REGISTRANT)
)(trustChainsHandler)
