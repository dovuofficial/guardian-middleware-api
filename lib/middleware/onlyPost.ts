import Request from 'lib/constants/request'
import Response from 'lib/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

function onlyPost(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		if (req.method === Request.POST) {
			return handler(req, res)
		}

		return Response.methodNotAllowed(res, req.method)
	}
}

export default onlyPost
