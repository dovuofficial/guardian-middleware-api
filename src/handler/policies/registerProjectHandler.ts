import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import language from 'src/constants/language'
import validateProjectRegistrationApplication from 'src/validators/validateProjectRegistrationApplication'
import Config from 'src/config'

type ProjectRegistration = components['schemas']['ProjectRegistration']

interface RegisterProjectRequest extends GuardianMiddlewareRequest {
	body: ProjectRegistration
}
async function RegisterProjectHandler(
	req: RegisterProjectRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { authorization } = req.headers
	const { engine } = req.context
	const { body } = req

	const accessToken = authorization?.split(' ')[1]

	if (!accessToken) {
		Response.unauthorised(res, 'Missing access token')
		return
	}

	const validationErrors = validateProjectRegistrationApplication(body)

	if (validationErrors) {
		Response.unprocessibleEntity(
			res,
			language.middleware.validate.message,
			validationErrors
		)
		return
	}

	const tag = Config.tags.initialApplicationSubmission

	const data = {
		document: body,
	}

	await engine.executeBlockViaTag(accessToken, policyId as string, tag, data)

	res.end()
}

export default RegisterProjectHandler
