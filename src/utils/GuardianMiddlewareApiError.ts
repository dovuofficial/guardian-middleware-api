import { ApiError } from 'next/dist/server/api-utils'

export default class GuardianMiddlewareApiError extends ApiError {
	readonly errors: Array<string> | undefined

	constructor(
		statusCode: number,
		message: string,
		errors: Array<string> | undefined = undefined
	) {
		super(statusCode, message)
		this.errors = errors
	}
}
