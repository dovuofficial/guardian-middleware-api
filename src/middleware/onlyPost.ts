import Request from 'src/constants/request'
import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

function onlyPost(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		if (req.method === Request.POST) {
			return handler(req, res)
		}

		return Response.methodNotAllowed(req.method)
	}
}

export default onlyPost
