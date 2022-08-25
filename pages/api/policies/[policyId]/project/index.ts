import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import ecologicalProjectHandler from 'src/handler/policies/ecologicalProjectHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'
import exceptionFilter from 'src/middleware/exceptionFilter'

export default prepare(
	exceptionFilter,
	onlyPost,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.REGISTRANT)
)(ecologicalProjectHandler)
