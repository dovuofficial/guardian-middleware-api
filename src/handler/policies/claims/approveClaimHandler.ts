import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { QueryBlockTag, QueryRoute, Tag } from 'src/config/guardianTags'
import { NextApiResponse } from 'next'

async function ApproveClaimHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { accessToken } = req
	const { policyId, id } = req.query
	const { engine } = req.context

	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		QueryBlockTag[QueryRoute.APPROVE_CLAIM]
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
		Tag.approveClaimRequestBtn,
		submission
	)

	res.end()
}

export default ApproveClaimHandler
