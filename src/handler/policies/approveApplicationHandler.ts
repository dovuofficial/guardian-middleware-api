import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import { Tag } from 'src/config/guardianTags'

type UserDid = components['schemas']['UserDid']

interface ApproveApplicationRequest extends GuardianMiddlewareRequest {
	body: UserDid
}

async function ApproveApplicationHandler(
	req: ApproveApplicationRequest,
	res: NextApiResponse
) {
	const { accessToken } = req
	const { policyId, did } = req.query
	const { engine } = req.context

	const tag = Tag.approveApplicationBlocks
	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		tag
	)

	const document = submissions.data?.find(
		(submission) => submission.owner === did
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
		Tag.approveApplicationBtn,
		submission
	)

	res.end()
}

export default ApproveApplicationHandler
