import { NextApiHandler, NextApiResponse } from 'next'
import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Language from 'src/constants/language'
import Response from 'src/response'
import { Role } from 'src/config'

const ensureRole = (role: Role) => {
	return (handler: NextApiHandler) => {
		return async (req: GuardianMiddlewareRequest, res: NextApiResponse) => {
			const { accessToken } = req
			const { guardian } = req.context
			const { policyId } = req.query

			const { ensureRole, withAuthenticationResponse } =
				Language.middleware

			if (!policyId) {
				return Response.unprocessibleEntity(
					res,
					ensureRole.policyRequired
				)
			}

			if (!accessToken) {
				return Response.unprocessibleEntity(
					res,
					withAuthenticationResponse.noAccessToken
				)
			}

			const policies = await guardian.policies.list(accessToken)
			const policy = policies.find((policy) => policy.id === policyId)

			if (!policy) {
				return Response.unprocessibleEntity(
					res,
					ensureRole.policyDoesNotExist
				)
			}

			// @ts-ignore (TODO: Can fix later.)
			const hasRoleInPolicy = !!policy.userRoles.find(
				(userRole) => userRole.toLowerCase() === role.toLowerCase()
			)

			if (hasRoleInPolicy) {
				return handler(req, res)
			}

			return Response.unauthorised(res, ensureRole[role])
		}
	}
}

export default ensureRole
