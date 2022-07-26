import Language from '@app/constants/language'
import Status from '@app/constants/status'
import { NextApiResponse } from 'next'
import { components } from '@app/spec/openapi'

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
	errors: Record<string, unknown>
) {
	return res.status(Status.UNPROCESSIBLE_ENTITY).send({ error: { errors } })
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
