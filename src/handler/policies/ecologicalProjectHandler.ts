import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import language from 'src/constants/language'
import validateEcologicalProjectSubmission from 'src/validators/validateEcologicalProjectSubmission'
import Config from 'src/config'

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
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const did = await engine.getCurrentUserDid(accessToken)

	const previousDocument = await engine.retrievePreviousBlockContext(
		policyId as string,
		did as string,
		Config.tags.approveApplicationBlocks
	)

	if (!previousDocument) {
		return Response.notFound(res)
	}

	const data = {
		document: body,
		ref: previousDocument,
	}

	await engine.executeBlockViaTag(
		accessToken,
		policyId as string,
		Config.tags.createEcologicalProject,
		data
	)

	res.end()
}

export default EcologicalProjectHandler
