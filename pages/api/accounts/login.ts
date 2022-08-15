import prepare from 'src/utils/prepare'
import loginHandler from 'src/handler/accounts/loginHandler'
import useGuardianContext from 'src/context/useGuardianContext'
import onlyPost from 'src/middleware/onlyPost'
import withHmac from 'src/middleware/withHmac'
import exceptionFilter from 'src/middleware/exceptionFilter'

export default prepare(
	exceptionFilter,
	onlyPost,
	withHmac,
	useGuardianContext
)(loginHandler)
