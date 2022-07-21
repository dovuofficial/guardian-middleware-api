import guardian, { Guardian } from '../guardian'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export interface GuardianMiddlewareRequest extends NextApiRequest {
	context: {
		guardian: Guardian
	}
}

type GuardianHandler<T = any> = (
	req: GuardianMiddlewareRequest,
	res: NextApiResponse<T>
) => unknown | Promise<unknown>

function useGuardianContext(handler: NextApiHandler): GuardianHandler {
	return (req: GuardianMiddlewareRequest, res: NextApiResponse) => {
		req.context = {
			guardian,
		}

		return handler(req, res)
	}
}

export default useGuardianContext
