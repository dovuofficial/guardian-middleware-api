import { NextApiHandler, NextApiResponse } from 'next'
import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Language from 'src/constants/language'
import Response from 'src/response'
import { Role } from 'src/config'

const ensureRole =
	(role: Role) =>
	(handler: NextApiHandler) =>
	async (req: GuardianMiddlewareRequest, res: NextApiResponse) => {
		const { accessToken } = req
		const { guardian } = req.context
		const { policyId } = req.query

		const { ensureRole: ensureRoleMessage, withAuthenticationResponse } =
			Language.middleware

		if (!policyId) {
			return Response.unprocessibleEntity(
				res,
				ensureRoleMessage.policyRequired
			)
		}

		if (!accessToken) {
			return Response.unprocessibleEntity(
				res,
				withAuthenticationResponse.noAccessToken
			)
		}

		const policies = await guardian.policies.list(accessToken)
		const policy = policies.find((p) => p.id === policyId)

		if (!policy) {
			return Response.unprocessibleEntity(
				res,
				ensureRoleMessage.policyDoesNotExist
			)
		}

		// @ts-ignore TODO: Policy needs typing
		const hasRoleInPolicy = !!policy.userRoles.find(
			(userRole) => userRole.toLowerCase() === role.toLowerCase()
		)

		if (hasRoleInPolicy) {
			return handler(req, res)
		}

		return Response.unauthorised(res, ensureRoleMessage[role])
	}

export default ensureRole
