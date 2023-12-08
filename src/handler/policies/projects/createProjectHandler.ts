import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import { Tag } from 'src/config/guardianTags'

type ProjectRegistration = components['schemas']['ProjectRegistration']

interface RegisterProjectRequest extends GuardianMiddlewareRequest {
	body: ProjectRegistration
}
async function CreateProjectHandler(
	req: RegisterProjectRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { engine } = req.context
	const { body, accessToken } = req

	const tag = Tag.initialProjectSubmission

	const data = {
		document: body,
	}

	await engine.executeBlockViaTag(accessToken, policyId as string, tag, data)

	res.end()
}

export default CreateProjectHandler
