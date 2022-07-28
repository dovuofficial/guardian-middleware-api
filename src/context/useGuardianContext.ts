import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import guardian, { Guardian } from '../guardian'
import engine, { Engine } from '../engine'

export interface GuardianMiddlewareRequest extends NextApiRequest {
	context: {
		guardian: Guardian
		engine: Engine
	}
}

type GuardianHandler<T = any> = (
	req: GuardianMiddlewareRequest,
	res: NextApiResponse<T>
) => unknown | Promise<unknown>

function useGuardianContext(handler: NextApiHandler): GuardianHandler {
	return (req: GuardianMiddlewareRequest, res: NextApiResponse) => {
		req.context = {
			...req.context,
			guardian,
			engine,
		}

		return handler(req, res)
	}
}

export default useGuardianContext