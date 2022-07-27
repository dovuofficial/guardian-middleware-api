import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'

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

	// TODO: Validate the request input

	const loginUser = await guardian.account.login(userCredentials)

	Response.json(res, loginUser)
}

export default loginHandler
