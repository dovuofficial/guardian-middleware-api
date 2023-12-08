import { GuardianMiddlewareRequest } from '../../../context/useGuardianContext'
import Response from '../../../response'
import { NextApiResponse } from 'next'
import { components } from '../../../spec/openapi'
import { QueryBlockTag, QueryRoute, Tag } from '../../../config/guardianTags'

type UserDid = components['schemas']['UserDid']

interface ApproveApplicationRequest extends GuardianMiddlewareRequest {
	body: UserDid
}

async function ApproveProjectHandler(
	req: ApproveApplicationRequest,
	res: NextApiResponse
) {
	const { accessToken } = req
	const { policyId, id } = req.query
	const { engine } = req.context

	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		QueryBlockTag[QueryRoute.PROJECTS]
	)

	const document = submissions.data?.find(
		(submission) => submission?.id === id
	)

	if (!document) {
		// TODO: Context, this might not be the best error, as it is the entity that failed to resolve.
		return Response.notFound()
	}

	const submission = {
		document,
		tag: Tag.approveBtn,
	}

	await engine.executeBlockViaTag(
		accessToken,
		policyId as string,
		Tag.approveProjectBtn,
		submission
	)

	res.end()
}

export default ApproveProjectHandler
