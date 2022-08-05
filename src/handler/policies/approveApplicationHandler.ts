import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import Config from 'src/config'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'

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

	const tag = Config.tags.approveApplicationBlocks
	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		tag
	)
	const document = submissions.data.find(
		(submission) => submission.owner === did
	)

	if (!document) {
		return Response.notFound(res)
	}

	const submission = {
		document,
		tag: Config.tags.approveBtn,
	}

	await engine.executeBlockViaTag(
		accessToken,
		policyId as string,
		Config.tags.approveApplicationBtn,
		submission
	)

	res.end()
}

export default ApproveApplicationHandler
