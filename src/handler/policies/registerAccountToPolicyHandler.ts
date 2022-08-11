import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import Config, { Role } from 'src/config'
import { NextApiResponse } from 'next'

async function RegisterAccountToPolicyHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId, roleType } = req.query
	const { engine } = req.context

	const role = (roleType as string)?.toUpperCase()

	if (role !== Role.REGISTRANT && role !== Role.VERIFIER) {
		return Response.unprocessibleEntity(res, [
			"Invalid role type. Must be 'registrant' or 'verifier'",
		])
	}

	const tag = Config.tags.chooseRole

	await engine.executeBlockViaTag(req.accessToken, policyId as string, tag, {
		role,
	})

	res.end()
}

export default RegisterAccountToPolicyHandler
