import { GuardianMiddlewareRequest } from 'lib/context/useGuardianContext'
import response from 'lib/response'
import { NextApiResponse } from 'next'

interface RegisterProjectRequest extends GuardianMiddlewareRequest {
	body: Record<string, unknown>
}
async function RegisterProjectHandler(
	req: RegisterProjectRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { authorization } = req.headers
	const { engine } = req.context
	const { body: data } = req

	const accessToken = authorization?.split(' ')[1]

	if (!accessToken) {
		response.unauthorised(res, 'Missing access token')
		return
	}

	if (!data) {
		response.unprocessibleEntity(res, 'Missing data in request body')
		return
	}

	const tag = 'create_application'

	await engine.executeBlockViaTag(accessToken, policyId as string, tag, data)

	res.end()
}

export default RegisterProjectHandler
