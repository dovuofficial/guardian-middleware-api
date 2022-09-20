import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import mrvSubmissionHandler from 'src/handler/policies/mrvSubmissionHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'

export default prepare(
	onlyPost,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.REGISTRANT)
)(mrvSubmissionHandler)
