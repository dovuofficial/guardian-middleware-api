import { GuardianMiddlewareRequest } from 'lib/context/useGuardianContext'
import response from 'lib/response'
import { NextApiResponse } from 'next'

async function RegisterAccountToPolicyHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { authorization } = req.headers
	const { engine } = req.context

	const accessToken = authorization?.split(' ')[1]

	if (!accessToken) {
		response.unauthorised(res, 'Missing access token')
		return
	}

	const tag = 'choose_role'
	const role = 'REGISTRANT'
	// TODO: Validate the request input
	await engine.executeBlockViaTag(accessToken, policyId as string, tag, {
		role,
	})

	res.end()
}

export default RegisterAccountToPolicyHandler
