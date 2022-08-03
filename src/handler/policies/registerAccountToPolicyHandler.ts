import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import response from 'src/response'
import Config from 'src/config'
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

	const tag = Config.tags.chooseRole
	const role = Config.roles.registrant

	// TODO: Validate the request input
	await engine.executeBlockViaTag(accessToken, policyId as string, tag, {
		role,
	})

	res.end()
}

export default RegisterAccountToPolicyHandler
