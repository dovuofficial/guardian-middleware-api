import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import validateProjectRegistrationApplication from 'src/validators/validateProjectRegistrationApplication'
import { Tag } from 'src/config/guardianTags'

type ProjectRegistration = components['schemas']['ProjectRegistration']

interface RegisterProjectRequest extends GuardianMiddlewareRequest {
	body: ProjectRegistration
}
async function RegisterProjectHandler(
	req: RegisterProjectRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { engine } = req.context
	const { body, accessToken } = req

	const validationErrors = validateProjectRegistrationApplication(body)

	if (validationErrors) {
		Response.unprocessibleEntity(validationErrors)
		return
	}

	const tag = Tag.initialApplicationSubmission

	const data = {
		document: body,
	}

	await engine.executeBlockViaTag(accessToken, policyId as string, tag, data)

	res.end()
}

export default RegisterProjectHandler
