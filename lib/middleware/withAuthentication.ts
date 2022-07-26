import Language from 'lib/constants/language'
import Validation from 'lib/validators'
import Response from 'lib/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const { noApikey, invalidApikey } =
	Language.middleware.withAuthenticationResponse

function withAuthentication(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		const apiKey = req.headers?.['x-api-key']

		if (apiKey === undefined || !apiKey.length) {
			return Response.unauthorised(res, noApikey)
		}

		if (!Validation.checkAuthenticationKey(apiKey)) {
			return Response.unauthorised(res, invalidApikey)
		}

		return handler(req, res)
	}
}

export default withAuthentication
