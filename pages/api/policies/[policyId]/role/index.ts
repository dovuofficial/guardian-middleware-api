import onlyPost from 'lib/middleware/onlyPost'
import prepare from 'lib/utils/prepare'
import useGuardianContext from 'lib/context/useGuardianContext'
import registerAccountToPolicyHandler from 'lib/handler/policies/registerAccountToPolicyHandler'

export default prepare(
	onlyPost,
	useGuardianContext
)(registerAccountToPolicyHandler)
