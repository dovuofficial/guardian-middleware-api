import Language from 'lib/constants/language'
import Status from 'lib/constants/status'
import { NextApiResponse } from 'next'
import { components } from 'lib/spec/openapi'

type ErrorApiResponse = components['schemas']['Error']

const { notAllowed } = Language.middleware.onlyPostResponse

function methodNotAllowed(
	res: NextApiResponse<ErrorApiResponse>,
	method: string
) {
	return res
		.status(Status.METHOD_NOT_ALLOWED)
		.send({ error: { message: notAllowed(method) } })
}

function unauthorised(res: NextApiResponse<ErrorApiResponse>, message: string) {
	return res.status(Status.UNAUTHORIZED).send({ error: { message } })
}

function unprocessibleEntity(
	res: NextApiResponse<ErrorApiResponse>,
	message: string,
	errors?: Array<{ message: string }>
) {
	return res
		.status(Status.UNPROCESSIBLE_ENTITY)
		.send({ error: { message, ...(errors ? { errors } : {}) } })
}

function badRequest(res: NextApiResponse<ErrorApiResponse>) {
	return res.status(Status.BAD_REQUEST).send({})
}

function json(res: NextApiResponse, data: Record<string, any>) {
	res.json({ data })
}

const response = {
	methodNotAllowed,
	unauthorised,
	unprocessibleEntity,
	badRequest,
	json,
}

export default response