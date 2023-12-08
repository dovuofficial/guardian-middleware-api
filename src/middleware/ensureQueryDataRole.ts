import { NextApiHandler, NextApiResponse } from 'next'
import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import Response from 'src/response'
import { QueryRoute, QueryRole } from 'src/config/guardianTags'
import Format from 'src/utils/format'
import Language from 'src/constants/language'
import ensureRole from './ensureRole'

const ensureQueryDataRole =
	(handler: NextApiHandler) =>
	async (req: GuardianMiddlewareRequest, res: NextApiResponse) => {
		const { entity } = req.query
		const entityQuery = entity as QueryRoute

		const { queryResponse } = Language.middleware

		const isValid = Object.values(QueryRoute).includes(entityQuery)

		if (!isValid) {
			const validValues = Format.joinWithComma(Object.values(QueryRoute))

			return Response.unprocessibleEntity(
				queryResponse.invalidType(validValues)
			)
		}

		const role = QueryRole[entityQuery]

		return ensureRole(role)(handler)(req, res)
	}

export default ensureQueryDataRole
