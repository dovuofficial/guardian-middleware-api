import onlyPut from 'src/middleware/onlyPut'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import approveApplicationHandler from 'src/handler/policies/approveApplicationHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import ensureStandardRegistryOwner from 'src/middleware/ensureStandardRegistryOwner'

export default prepare(
	onlyPut,
	withHmac,
	useGuardianContext,
	withAuthentication,
	ensureStandardRegistryOwner
)(approveApplicationHandler)
