import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import Config, { MRV } from 'src/config'
import { NextApiResponse } from 'next'
import language from 'src/constants/language'

async function ApproveMrvRequestHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { accessToken } = req
	const { policyId, did, mrvType } = req.query
	const { engine } = req.context

	const mrv = (mrvType as string)?.toLowerCase()
	if (mrv !== MRV.AGRECALC && mrv !== MRV.COOL_FARM_TOOL) {
		return Response.unprocessibleEntity(
			res,
			language.middleware.ensureMrv.unknownMrv
		)
	}

	const submissions = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		Config.tags.approveMrvRequest
	)

	const document = submissions.data?.find(
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
		Config.tags.approveMrvRequestBtn,
		submission
	)

	res.end()
}

export default ApproveMrvRequestHandler
