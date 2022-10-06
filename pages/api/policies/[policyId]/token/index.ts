import onlyGet from 'src/middleware/onlyGet'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import fetchTokenInformation from 'src/handler/policies/fetchTokenInformation'
import withAuthentication from 'src/middleware/withAuthentication'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'

export default prepare(
	onlyGet,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.STANDARD_REGISTRY)
)(fetchTokenInformation)
