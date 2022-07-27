import onlyPost from 'src/middleware/onlyPost'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import registerAccountToPolicyHandler from 'src/handler/policies/registerAccountToPolicyHandler'

export default prepare(
	onlyPost,
	useGuardianContext
)(registerAccountToPolicyHandler)
