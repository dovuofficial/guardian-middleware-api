import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import StatusCode from 'src/constants/status'
import { components } from 'src/spec/openapi'
import GuardianMiddlewareApiError from 'src/utils/GuardianMiddlewareApiError'
import { AxiosError } from 'axios'

type ErrorApiResponse = components['schemas']['ErrorResponse']

function getExceptionStatus(exception: ApiError | AxiosError) {
	if (exception instanceof ApiError) {
		return exception.statusCode || StatusCode.INTERNAL_SERVER_ERROR
	}
	if (getIsGuardianException(exception)) {
		return (
			(exception as AxiosError).response?.status ||
			StatusCode.INTERNAL_SERVER_ERROR
		)
	}
	return StatusCode.INTERNAL_SERVER_ERROR
}

function getExceptionErrors(exception: unknown) {
	return exception instanceof GuardianMiddlewareApiError
		? exception.errors
		: undefined
}

function getExceptionMessage(exception: ApiError | AxiosError) {
	if (isError(exception)) {
		return exception.message || `Internal Server Error`
	}
	if (getIsGuardianException(exception)) {
		return (
			(exception as AxiosError).response?.statusText ||
			`Internal Server Error`
		)
	}
	return `Internal Server Error`
}

function getExceptionStack(exception: unknown) {
	return isError(exception) ? exception.stack : undefined
}

function isError(exception: unknown): exception is Error {
	return exception instanceof Error
}

function getIsGuardianException(exception: AxiosError) {
	const axiosConfig = exception.isAxiosError && exception.config

	if (!axiosConfig) {
		return false
	}

	const guardianBaseUrl = new URL(process.env.GUARDIAN_API_URL)
	const requestBaseUrl = new URL(axiosConfig.baseURL)
	return requestBaseUrl.host === guardianBaseUrl.host
}

function jsonValidationParse(exception: AxiosError) {
	const message = exception?.response?.data?.message

	console.log(exception?.response?.data)

	if (!message) {
		return null
	}

	const JSON_VALID_ERROR = "JSON_SCHEMA_VALIDATION_ERROR"

	// console.log(message)
	if (message.includes(JSON_VALID_ERROR)) {

		const error = JSON.parse(message.split('Error: ')[1])

		return error.details
	}

	return null
}

function exceptionFilter(handler: NextApiHandler) {
	return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		try {
			await handler(req, res)
		} catch (exception) {
			const { url, headers, body } = req

			const statusCode = getExceptionStatus(exception)
			const message = getExceptionMessage(exception)
			const stack = getExceptionStack(exception)
			const errors = getExceptionErrors(exception)
			const isGuardianException = getIsGuardianException(exception)

			// @ts-ignore
			const auth = req.accessToken ?? 'Not Authenticated'

			const { referer } = headers
			const userAgent = headers['user-agent']

			const requestContext = {
				isGuardianException,
				url,
				auth,
				referer,
				userAgent,
				message,
				errors,
				statusCode,
			}

			if (statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
				console.error(requestContext)
			} else {
				console.debug(requestContext)
			}

			if (stack) {
				console.debug(stack)
			}

			// TODO: Remove Temporary JSON validation check
			const jsonValidationErrors = jsonValidationParse(exception)

			const timestamp = new Date().toISOString()

			const updatedStatusCode = jsonValidationErrors ? 422 : statusCode

			const responseBody: ErrorApiResponse = {
				error: {
					message,
					// TODO: Temporary JSON validation error catch (to delete)
					statusCode: updatedStatusCode,
					timestamp,
					jsonValidationErrors,
					path: req.url,
					...(errors ? { errors } : {}),
				},
			}

			res.status(updatedStatusCode).send(responseBody)
		}
	}
}

export default exceptionFilter
