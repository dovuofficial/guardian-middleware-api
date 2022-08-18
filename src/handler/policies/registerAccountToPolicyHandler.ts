import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { Role } from 'src/config/guardianTags'
import { NextApiResponse } from 'next'
import language from 'src/constants/language'
import { Tag } from 'src/config/guardianTags'

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

	const tag = Tag.chooseRole

	await engine.executeBlockViaTag(req.accessToken, policyId as string, tag, {
		role,
	})

	res.end()
}

export default RegisterAccountToPolicyHandler
