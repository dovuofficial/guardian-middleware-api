import Request from 'src/constants/request'
import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

function onlyPut(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		if (req.method === Request.PUT) {
			return handler(req, res)
		}

		return Response.methodNotAllowed(res, req.method)
	}
}

export default onlyPut
