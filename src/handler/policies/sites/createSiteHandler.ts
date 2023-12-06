import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import { QueryBlockTag, QueryRoute } from 'src/config/guardianTags'

type EcologicalProject = components['schemas']['EcologicalProject']

interface EcologicalProjectRequest extends GuardianMiddlewareRequest {
	body: EcologicalProject
}

async function CreateSiteHandler(
	req: EcologicalProjectRequest,
	res: NextApiResponse
) {
	const { policyId, id } = req.query
	const { engine } = req.context
	const { body, accessToken } = req
	const tag = QueryBlockTag[QueryRoute.CREATE_SITE]

	const submission = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		tag
	)

	// @ts-ignore
	if (submission?.data?.id !== id) {
		// TODO: Context, this might not be the best error, as it is the entity that failed to resolve.
		return Response.notFound()
	}

	const data = {
		document: body,
		ref: submission.data,
	}

	await engine.executeBlockViaTag(accessToken, policyId as string, tag, data)

	res.end()
}

export default CreateSiteHandler
