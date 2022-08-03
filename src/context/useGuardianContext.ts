import { AuthorisedNextApiRequest } from 'src/middleware/withAuthentication'
import { NextApiHandler, NextApiResponse } from 'next'
import guardian, { Guardian } from 'src/guardian'
import engine, { Engine } from 'src/engine'

export interface GuardianMiddlewareRequest extends AuthorisedNextApiRequest {
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
