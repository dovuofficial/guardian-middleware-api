import hashgraphClient, {
	HashgraphClient,
} from '@lib/hashgraph/hashgraphClient'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export interface HashgraphMiddlewareRequest extends NextApiRequest {
	context: {
		hashgraphClient: HashgraphClient
	}
}

type HashgraphHandler<T = any> = (
	req: HashgraphMiddlewareRequest,
	res: NextApiResponse<T>
) => unknown | Promise<unknown>

function useHashgraphContext(handler: NextApiHandler): HashgraphHandler {
	return async (req: HashgraphMiddlewareRequest, res: NextApiResponse) => {
		req.context = {
			...req.context,
			hashgraphClient,
		}

		return handler(req, res)
	}
}

export default useHashgraphContext
