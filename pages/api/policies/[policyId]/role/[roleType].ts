import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import registerAccountToPolicyHandler from 'src/handler/policies/registerAccountToPolicyHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import withHmac from 'src/middleware/withHmac'
import exceptionFilter from 'src/middleware/exceptionFilter'

export default prepare(
	exceptionFilter,
	onlyPost,
	withHmac,
	useGuardianContext,
	withAuthentication
)(registerAccountToPolicyHandler)
