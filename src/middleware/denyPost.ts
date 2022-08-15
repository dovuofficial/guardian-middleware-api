import Request from 'src/constants/request'
import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

function denyPost(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		if (req.method === Request.POST) {
			return Response.methodNotAllowed(req.method)
		}

		return handler(req, res)
	}
}

export default denyPost
