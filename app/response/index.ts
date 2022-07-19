import Language from 'app/constants/language'
import Status from 'app/constants/status'
import { NextApiResponse } from 'next'

const { notAllowed } = Language.middleware.onlyPostResponse

function methodNotAllowed(res: NextApiResponse, method) {
	return res
		.status(Status.METHOD_NOT_ALLOWED)
		.send({ reason: notAllowed(method) })
}

function unauthorised(res: NextApiResponse, reason) {
	return res.status(Status.UNAUTHORIZED).send({ reason })
}

function unprocessibleEntity(res: NextApiResponse, errors) {
	return res.status(Status.UNPROCESSIBLE_ENTITY).send({ errors })
}

function badRequest(res: NextApiResponse) {
	return res.status(Status.BAD_REQUEST).send({})
}

function json(res: NextApiResponse, data) {
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
