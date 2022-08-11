import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import Config, { Role } from 'src/config'
import { NextApiResponse } from 'next'

async function RegisterAccountToPolicyHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId, roleType } = req.query
	const { authorization } = req.headers
	const { engine } = req.context

	const accessToken = authorization?.split(' ')[1]

	if (!accessToken) {
		return Response.unauthorised(res, 'Missing access token')
	}

	const role = (roleType as string)?.toUpperCase()
	if (role !== Role.REGISTRANT && role !== Role.VERIFIER) {
		return Response.unprocessibleEntity(
			res,
			"Invalid role type. Must be 'registrant' or 'verifier'"
		)
	}

	const tag = Config.tags.chooseRole

	// TODO: Validate the request input
	await engine.executeBlockViaTag(accessToken, policyId as string, tag, {
		role,
	})

	res.end()
}

export default RegisterAccountToPolicyHandler
