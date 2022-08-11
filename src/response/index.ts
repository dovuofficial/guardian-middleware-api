import Language from 'src/constants/language'
import StatusCode from 'src/constants/status'
import { NextApiResponse } from 'next'
import { components } from 'src/spec/openapi'

type ErrorApiResponse = components['schemas']['ErrorResponse']
type UnprocessableErrorApiResponse =
	components['schemas']['UnprocessableErrorResponse']

const { notAllowed } = Language.middleware.onlyPostResponse

function methodNotAllowed(
	res: NextApiResponse<ErrorApiResponse>,
	method: string
) {
	return res
		.status(StatusCode.METHOD_NOT_ALLOWED)
		.send({ error: { message: notAllowed(method) } })
}

function unauthorised(res: NextApiResponse<ErrorApiResponse>, message: string) {
	return res.status(StatusCode.UNAUTHORIZED).send({ error: { message } })
}

function unprocessibleEntity(
	res: NextApiResponse<UnprocessableErrorApiResponse>,
	errors?: Array<string>
) {
	return res.status(StatusCode.UNPROCESSIBLE_ENTITY).send({
		error: {
			message: Language.errorCode[StatusCode.UNPROCESSIBLE_ENTITY],
			...(errors ? { errors } : {}),
		},
	})
}

function badRequest(res: NextApiResponse<ErrorApiResponse>) {
	return standardErrorResponse(res, StatusCode.BAD_REQUEST)
}

function notFound(res: NextApiResponse<ErrorApiResponse>) {
	return standardErrorResponse(res, StatusCode.NOT_FOUND)
}

function standardErrorResponse(
	res: NextApiResponse<ErrorApiResponse>,
	statusCode: StatusCode
) {
	return res
		.status(statusCode)
		.send({ error: { message: Language.errorCode[statusCode] } })
}

function json(res: NextApiResponse, data: Record<string, any>) {
	res.json({ data })
}

function serverError(res: NextApiResponse, error: any) {
	// Filter out all Guardian errors
	if (error.isAxiosError) {
		return res.status(error.response?.status ?? 500).send(
			error.response?.data ?? {
				message: Language.middleware.guardian.serverError,
			}
		)
	}

	// TODO: Abstract error handling out to a its own middleware and attach a logger to it
	// Let NextJS handle all other errors like normal
	throw error
}

const response = {
	notFound,
	methodNotAllowed,
	unauthorised,
	unprocessibleEntity,
	badRequest,
	json,
	serverError,
}

export default response
