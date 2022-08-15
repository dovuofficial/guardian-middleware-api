import Language from 'src/constants/language'
import StatusCode from 'src/constants/status'
import { NextApiResponse } from 'next'
import GuardianApiError from 'src/utils/GuardianApiError'

const { notAllowed } = Language.middleware.onlyPostResponse

function methodNotAllowed(method: string) {
	throw new GuardianApiError(
		StatusCode.METHOD_NOT_ALLOWED,
		notAllowed(method)
	)
}

function unauthorised(message: string) {
	errorResponse(StatusCode.UNAUTHORIZED, message)
}

function unprocessibleEntity(errors?: string | Array<string>) {
	throw new GuardianApiError(
		StatusCode.UNPROCESSIBLE_ENTITY,
		Language.errorCode[StatusCode.UNPROCESSIBLE_ENTITY],
		errors && (errors instanceof Array ? errors : [errors])
	)
}

function badRequest() {
	errorResponse(StatusCode.BAD_REQUEST)
}

function notFound() {
	errorResponse(StatusCode.NOT_FOUND)
}

function errorResponse(statusCode: StatusCode, message?: string) {
	throw new GuardianApiError(
		statusCode,
		message || Language.errorCode[statusCode]
	)
}

function json(res: NextApiResponse, data: Record<string, any>) {
	res.json({ data })
}

const response = {
	notFound,
	methodNotAllowed,
	unauthorised,
	unprocessibleEntity,
	badRequest,
	json,
}

export default response
