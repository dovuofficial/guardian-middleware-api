import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import credentials from 'src/validators/credentials'
import language from 'src/constants/language'

type Credentials = {
	username: string
	password: string
}

interface LoginRequest extends GuardianMiddlewareRequest {
	body: Credentials
}

async function loginHandler(req: LoginRequest, res: NextApiResponse) {
	const { body: userCredentials } = req

	const { guardian } = req.context

	const validationErrors = credentials(userCredentials)

	if (validationErrors) {
		return Response.unprocessibleEntity(
			res,
			language.middleware.validate.message,
			validationErrors
		)
	}

	const loginUser = await guardian.account.login(userCredentials)

	Response.json(res, loginUser)
}

export default loginHandler
