import Request from '@app/constants/request'
import Response from '@app/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

function denyPost(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		if (req.method === Request.POST) {
			return Response.methodNotAllowed(res, req.method)
		}

		return handler(req, res)
	}
}

export default denyPost
