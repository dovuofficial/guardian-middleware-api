import Language from 'src/constants/language'
import Response from 'src/response'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const { noAccessToken, invalidAuthType } =
	Language.middleware.withAuthenticationResponse

export interface AuthorisedNextApiRequest extends NextApiRequest {
	accessToken: string
}

function withAuthentication(handler: NextApiHandler) {
	return (req: AuthorisedNextApiRequest, res: NextApiResponse) => {
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

		req.accessToken = accessToken

		return handler(req, res)
	}
}

export default withAuthentication
