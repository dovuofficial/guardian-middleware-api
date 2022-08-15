import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import Config, { Role } from 'src/config'
import { NextApiResponse } from 'next'
import language from 'src/constants/language'

async function RegisterAccountToPolicyHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId, roleType } = req.query
	const { engine } = req.context

	const role = (roleType as string)?.toUpperCase()

	if (role !== Role.REGISTRANT && role !== Role.VERIFIER) {
		return Response.unprocessibleEntity(
			language.middleware.validate.invalidRole
		)
	}

	const tag = Config.tags.chooseRole

	await engine.executeBlockViaTag(req.accessToken, policyId as string, tag, {
		role,
	})

	res.end()
}

export default RegisterAccountToPolicyHandler
