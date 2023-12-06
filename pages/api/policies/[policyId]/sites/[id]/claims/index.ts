import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import createClaimHandler from 'src/handler/policies/claims/createClaimHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'

/**
 * 6 Month Deprecation notice: December 2023 - May 2024
 */
export default prepare(
	onlyPost,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureRole(Role.SUPPLIER)
)(createClaimHandler)
