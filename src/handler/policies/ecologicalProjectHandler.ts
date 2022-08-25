import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import validateEcologicalProjectSubmission from 'src/validators/validateEcologicalProjectSubmission'
import { Tag } from 'src/config/guardianTags'

type EcologicalProject = components['schemas']['EcologicalProject']

interface EcologicalProjectRequest extends GuardianMiddlewareRequest {
	body: EcologicalProject
}

async function EcologicalProjectHandler(
	req: EcologicalProjectRequest,
	res: NextApiResponse
) {
	const { policyId } = req.query
	const { engine } = req.context
	const { body, accessToken } = req

	const validationErrors = validateEcologicalProjectSubmission(body)

	if (validationErrors) {
		return Response.unprocessibleEntity(validationErrors)
	}

	const did = await engine.getCurrentUserDid(accessToken)

	const previousDocument = await engine.retrievePreviousBlockContext(
		policyId as string,
		did as string,
		Tag.approveApplicationBlocks
	)

	if (!previousDocument) {
		return Response.notFound()
	}

	const data = {
		document: body,
		ref: previousDocument,
	}

	await engine.executeBlockViaTag(
		accessToken,
		policyId as string,
		Tag.createEcologicalProject,
		data
	)

	res.end()
}

export default EcologicalProjectHandler
