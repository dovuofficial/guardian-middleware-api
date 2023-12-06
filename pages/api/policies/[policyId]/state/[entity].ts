import onlyGet from 'src/middleware/onlyGet'
import prepare from 'src/utils/prepare'
import useGuardianContext from 'src/context/useGuardianContext'
import queryEntityHandler from 'src/handler/state/queryEntityHandler'
import withAuthentication from 'src/middleware/withAuthentication'
import ensureQueryDataRole from 'src/middleware/ensureQueryDataRole'

export default prepare(
	onlyGet,
	useGuardianContext,
	withAuthentication,
	ensureQueryDataRole
)(queryEntityHandler)
