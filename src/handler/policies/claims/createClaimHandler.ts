import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import { QueryBlockTag, QueryRoute, Tag } from 'src/config/guardianTags'

type MeasurementReportingVerification =
	components['schemas']['MeasurementReportingVerification']

interface MRVRequest extends GuardianMiddlewareRequest {
	body: MeasurementReportingVerification
}

async function CreateClaimHandler(req: MRVRequest, res: NextApiResponse) {
	const { policyId, id } = req.query
	const { engine } = req.context
	const { body, accessToken } = req

	const tag = QueryBlockTag[QueryRoute.CREATE_CLAIM]

	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		tag
	)

	// console.dir(submissions, { depth: null })

	const submission = submissions.data?.find((elem) => elem?.id === id)

	if (!submission) {
		// TODO: Context, this might not be the best error, as it is the entity that failed to resolve.
		return Response.notFound()
	}

	const data = {
		document: body,
		ref: submission,
	}

	await engine.executeBlockViaTag(
		accessToken,
		policyId as string,
		Tag.createClaim,
		data
	)

	res.end()
}

export default CreateClaimHandler
