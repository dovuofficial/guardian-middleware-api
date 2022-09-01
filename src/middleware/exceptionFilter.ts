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
