import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import validateCredentials from 'src/validators/validateCredentials'
import language from 'src/constants/language'
import { components } from 'src/spec/openapi'

type Credentials = components['schemas']['Credentials']

interface LoginRequest extends GuardianMiddlewareRequest {
	body: Credentials
}

async function loginHandler(req: LoginRequest, res: NextApiResponse) {
	const { body: userCredentials } = req

	const { guardian } = req.context

	const validationErrors = validateCredentials(userCredentials)

	if (validationErrors) {
		Response.unprocessibleEntity(
			res,
			language.middleware.validate.message,
			validationErrors
		)
		return
	}

	const loginUser = await guardian.account.login(userCredentials)

	Response.json(res, loginUser)
}

export default loginHandler
