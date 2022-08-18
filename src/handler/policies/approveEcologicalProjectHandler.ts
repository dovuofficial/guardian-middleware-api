import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { Tag } from 'src/config/guardianTags'
import { NextApiResponse } from 'next'

async function ApproveEcologicalProjectHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { accessToken } = req
	const { policyId, did } = req.query
	const { engine } = req.context

	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		Tag.approveEcologicalProject
	)

	const document = submissions.data.find(
		// TODO: Temporary, we need a way of returning an identifier.
		(submission) =>
			submission.owner === did && submission.option.status !== 'Approved'
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
		Tag.approveEcologicalProjectBtn,
		submission
	)

	res.end()
}

export default ApproveEcologicalProjectHandler
