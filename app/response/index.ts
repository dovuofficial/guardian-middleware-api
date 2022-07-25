import Language from '@app/constants/language'
import Status from '@app/constants/status'
import { NextApiResponse } from 'next'

const { notAllowed } = Language.middleware.onlyPostResponse

function methodNotAllowed(res: NextApiResponse, method: string) {
	return res
		.status(Status.METHOD_NOT_ALLOWED)
		.send({ message: notAllowed(method) })
}

function unauthorised(res: NextApiResponse, message: string) {
	return res.status(Status.UNAUTHORIZED).send({ message })
}

function unprocessibleEntity(
	res: NextApiResponse,
	errors: Record<string, unknown>
) {
	return res.status(Status.UNPROCESSIBLE_ENTITY).send({ errors })
}

function badRequest(res: NextApiResponse) {
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
