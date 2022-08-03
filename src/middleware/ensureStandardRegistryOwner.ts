import { NextApiHandler, NextApiResponse } from 'next'
import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Language from 'src/constants/language'
import Response from 'src/response'
import Config from 'src/config'

function ensureStandardRegistryOwner(handler: NextApiHandler) {
	return async (req: GuardianMiddlewareRequest, res: NextApiResponse) => {
		const { accessToken } = req
		const { guardian } = req.context

		const { ensureStandardRegistryOwner, withAuthenticationResponse } =
			Language.middleware

		if (!accessToken) {
			return Response.unprocessibleEntity(
				res,
				withAuthenticationResponse.noAccessToken
			)
		}

		const session = await guardian.account.session(accessToken)

		if (session.role !== Config.roles.standardRegistry) {
			return Response.unauthorised(
				res,
				ensureStandardRegistryOwner.standardRegistry
			)
		}

		return handler(req, res)
	}
}

export default ensureStandardRegistryOwner
