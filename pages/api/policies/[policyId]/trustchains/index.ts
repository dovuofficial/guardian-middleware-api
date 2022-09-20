import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import trustChainsHandler from 'src/handler/policies/trustChainsHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureRole from 'src/middleware/ensureRole'
import { Role } from 'src/config/guardianTags'
import onlyGet from 'src/middleware/onlyGet'
import config from 'src/config'

const generateMiddleware = () => {
	const base = [onlyGet, useGuardianContext]

	if (!config.publicTrustChainAccess) {
		return [
			...base,
			withHmac,
			withAuthentication,
			ensureRole(Role.STANDARD_REGISTRY),
		]
	}

	return base
}

export default prepare(...generateMiddleware())(trustChainsHandler)
