import { GuardianMiddlewareRequest } from '../../../context/useGuardianContext'
import Response from '../../../response'
import { QueryBlockTag, QueryRoute, Tag } from '../../../config/guardianTags'
import { NextApiResponse } from 'next'

async function ApproveSiteHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { accessToken } = req
	const { policyId, id } = req.query
	const { engine } = req.context

	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		QueryBlockTag[QueryRoute.APPROVE_SITE]
	)

	const document = submissions.data?.find(
		(submission) => submission?.id === id
	)

	if (!document) {
		return Response.notFound()
	}

	const submission = {
		document,
		tag: Tag.approveBtn,
	}

	await engine.executeBlockViaTag(
		accessToken,
		policyId as string,
		Tag.approveSiteBtn,
		submission
	)

	res.end()
}

export default ApproveSiteHandler
