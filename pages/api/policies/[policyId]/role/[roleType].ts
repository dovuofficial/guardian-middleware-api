import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import registerAccountToPolicyHandler from 'src/handler/policies/registerAccountToPolicyHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'

export default prepare(
	onlyPost,
	withHmac,
	useGuardianContext,
	withAuthentication
)(registerAccountToPolicyHandler)
