import Language from 'src/constants/language'
import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const { noAccessToken, invalidAuthType } =
	Language.middleware.withAuthenticationResponse

function withAuthentication(handler: NextApiHandler) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		const { authorization } = req.headers

		if (!authorization) {
			return Response.unauthorised(res, noAccessToken)
		}

		const [type, accessToken] = authorization?.split(' ') || []

		if (type?.toLowerCase() !== 'bearer') {
			return Response.unauthorised(res, invalidAuthType(type))
		}
		if (!accessToken) {
			return Response.unauthorised(res, noAccessToken)
		}

		return handler(req, res)
	}
}

export default withAuthentication
