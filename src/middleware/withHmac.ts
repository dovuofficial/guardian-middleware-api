import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import hmac from 'src/utils/hmac'

function withHmac(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		const signature = req.headers['x-signature']

		const stringifyData = JSON.stringify(req.body)
		const isSignatureValid = hmac.validateSignature(
			stringifyData,
			signature
		)

		if (!isSignatureValid) {
			return Response.unauthorised(
				res,
				'You are not authorised to access this resource'
			)
		}

		return handler(req, res)
	}
}

export default withHmac
