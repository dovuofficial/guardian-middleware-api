import Language from 'src/constants/language'
import StatusCode from 'src/constants/status'
import { NextApiResponse } from 'next'
import GuardianMiddlewareApiError from 'src/utils/GuardianMiddlewareApiError'

const { notAllowed } = Language.middleware.onlyPostResponse

function methodNotAllowed(method: string) {
	throwApiError(StatusCode.METHOD_NOT_ALLOWED, notAllowed(method))
}

function unauthorised(message: string) {
	throwApiError(StatusCode.UNAUTHORIZED, message)
}

function unprocessibleEntity(errors?: string | Array<string>) {
	throwApiError(
		StatusCode.UNPROCESSIBLE_ENTITY,
		Language.errorCode[StatusCode.UNPROCESSIBLE_ENTITY],
		errors
	)
}

function badRequest() {
	throwApiError(StatusCode.BAD_REQUEST)
}

function notFound() {
	throwApiError(StatusCode.NOT_FOUND)
}

function throwApiError(
	statusCode: StatusCode,
	message?: string,
	errors?: string | Array<string>
) {
	throw new GuardianMiddlewareApiError(
		statusCode,
		message || Language.errorCode[statusCode],
		errors && (errors instanceof Array ? errors : [errors])
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
