import guardian from '../guardian'
import engine from '../engine'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

function useGuardianContext(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		req.context = {
			guardian,
			engine,
		}

		return handler(req, res)
	}
}

export default useGuardianContext
