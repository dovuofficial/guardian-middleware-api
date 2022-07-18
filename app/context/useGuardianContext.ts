import guardian from '../guardian'
import engine from '../engine'

function useGuardianContext(handler) {
	return async (req, res) => {
		req.context = {
			guardian,
			engine,
		}

		return handler(req, res)
	}
}

export default useGuardianContext
