import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { Role, Tag } from 'src/config/guardianTags'
import { NextApiResponse } from 'next'
import language from 'src/constants/language'

async function RegisterAccountToPolicyHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId, roleType } = req.query
	const { engine } = req.context

	const role = (roleType as string)?.toUpperCase()

	if (role !== Role.SUPPLIER && role !== Role.VERIFIER) {
		return Response.unprocessibleEntity(
			language.middleware.validate.invalidRole
		)
	}

	const tag = Tag.chooseRole

	// capitalise the first letter of the role
	const roleTag = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

	await engine.executeBlockViaTag(req.accessToken, policyId as string, tag, {
		role: roleTag,
	})

	res.end()
}

export default RegisterAccountToPolicyHandler
