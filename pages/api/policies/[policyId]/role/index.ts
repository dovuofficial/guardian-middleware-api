import onlyPost from '@app/middleware/onlyPost'
import prepare from '@app/utils/prepare'
import useGuardianContext from '@app/context/useGuardianContext'
import registerAccountToPolicyHandler from '@app/handler/policies/registerAccountToPolicyHandler'

export default prepare(
	onlyPost,
	useGuardianContext
)(registerAccountToPolicyHandler)
