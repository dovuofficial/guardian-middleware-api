import { NextApiHandler, NextApiResponse } from 'next'
import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Language from 'src/constants/language'
import Response from 'src/response'
import { Role } from 'src/config'

const ensureRole = (role: Role) => (handler: NextApiHandler) => {
	return async (req: GuardianMiddlewareRequest, res: NextApiResponse) => {
		const { accessToken } = req
		const { guardian } = req.context

		const { ensureRole, withAuthenticationResponse } = Language.middleware

		if (!accessToken) {
			return Response.unprocessibleEntity(
				res,
				withAuthenticationResponse.noAccessToken
			)
		}

		const session = await guardian.account.session(accessToken)

		if (session.role !== role) {
			return Response.unauthorised(res, ensureRole[role])
		}

		return handler(req, res)
	}
}

export default ensureRole
