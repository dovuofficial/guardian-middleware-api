import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import trustChainsHandler from 'src/handler/policies/trustChainsHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'
import exceptionFilter from 'src/middleware/exceptionFilter'
import onlyGet from 'src/middleware/onlyGet'
import config from 'src/config'

const isProtected = !config.publicTrustChainAccess
const emptyHandler = (handler) => (req, res) => handler(req, res)

export default prepare(
	exceptionFilter,
	onlyGet,
	useGuardianContext,
	isProtected ? withHmac : emptyHandler,
	isProtected ? withAuthentication : emptyHandler,
	isProtected ? ensureRole(Role.STANDARD_REGISTRY) : emptyHandler
)(trustChainsHandler)
