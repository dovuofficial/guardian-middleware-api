import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'
import language from 'src/constants/language'
import validateMrvDocumentSubmission from 'src/validators/validateMrvDocumentSubmission'
import config from 'src/config'

type MeasurementReportingVerification =
	components['schemas']['MeasurementReportingVerification']

interface MRVRequest extends GuardianMiddlewareRequest {
	body: MeasurementReportingVerification
}

async function MrvSubmissionHandler(req: MRVRequest, res: NextApiResponse) {
	const { policyId, mrvType } = req.query
	const { engine } = req.context
	const { body, accessToken } = req

	const validationErrors = validateMrvDocumentSubmission(
		mrvType as string,
		body
	)

	if (validationErrors) {
		return Response.unprocessibleEntity(validationErrors)
	}

	const did = await engine.getCurrentUserDid(accessToken)

	const previousDocument = await engine.retrievePreviousBlockContext(
		policyId as string,
		did as string,
		config.tags.approveEcologicalProject
	)

	if (!previousDocument) {
		return Response.notFound()
	}

	const data = {
		document: body,
		ref: previousDocument,
	}

	await engine.executeBlockViaTag(
		accessToken,
		policyId as string,
		config.tags.mrvSubmission,
		data
	)

	res.end()
}

export default MrvSubmissionHandler
