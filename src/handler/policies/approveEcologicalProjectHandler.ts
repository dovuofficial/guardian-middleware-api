import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import Config from 'src/config'
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
		Config.tags.approveEcologicalProject
	)

	const document = submissions.data.find(
		// TODO: Temporary, we need a way of returning an identifier.
		(submission) =>
			submission.owner === did && submission.option.status !== 'Approved'
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
		Config.tags.approveEcologicalProjectBtn,
		submission
	)

	res.end()
}

export default ApproveEcologicalProjectHandler
