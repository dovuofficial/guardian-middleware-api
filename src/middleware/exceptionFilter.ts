import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import StatusCode from 'src/constants/status'
import { components } from 'src/spec/openapi'
import GuardianApiError from 'src/utils/GuardianApiError'

type ErrorApiResponse = components['schemas']['ErrorResponse']

function getExceptionStatus(exception: unknown) {
	return exception instanceof ApiError
		? exception.statusCode
		: StatusCode.INTERNAL_SERVER_ERROR
}

function getExceptionErrors(exception: unknown) {
	return exception instanceof GuardianApiError ? exception.errors : undefined
}

function getExceptionMessage(exception: unknown) {
	return isError(exception) ? exception.message : `Internal Server Error`
}

function getExceptionStack(exception: unknown) {
	return isError(exception) ? exception.stack : undefined
}

function isError(exception: unknown): exception is Error {
	return exception instanceof Error
}

function exceptionFilter(handler: NextApiHandler) {
	return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		try {
			await handler(req, res)
		} catch (exception) {
			const { url, headers } = req

			const statusCode = getExceptionStatus(exception)
			const message = getExceptionMessage(exception)
			const stack = getExceptionStack(exception)
			const errors = getExceptionErrors(exception)

			// @ts-ignore
			const auth = req.accessToken ?? 'Not Authenticated'

			const { referer } = headers
			const userAgent = headers['user-agent']

			const requestContext = {
				url,
				auth,
				referer,
				userAgent,
				message,
				errors,
			}

			if (statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
				console.error(requestContext)
			} else {
				console.debug(requestContext)
			}

			if (stack) {
				console.debug(stack)
			}

			const timestamp = new Date().toISOString()

			const responseBody: ErrorApiResponse = {
				error: {
					message,
					statusCode,
					timestamp,
					path: req.url,
					...(errors ? { errors } : {}),
				},
			}

			res.status(statusCode).send(responseBody)
		}
	}
}

export default exceptionFilter
