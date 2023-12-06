import { GuardianMiddlewareRequest } from 'src/context/useGuardianContext'
import { NextApiResponse } from 'next'
import applyFilters from 'src/utils/query'
import { EntityState, QueryBlockTag } from 'src/config/guardianTags'

async function QueryEntityHandler(
	req: GuardianMiddlewareRequest,
	res: NextApiResponse
) {
	const { policyId, entity, status, ...filters } = req.query
	const { engine } = req.context
	const { accessToken } = req

	const queryData = await engine.fetchBlockSubmissions(
		accessToken,
		policyId as string,
		QueryBlockTag[entity as string]
	)

	const entityStatus =
		status && EntityState[(status as EntityState).toUpperCase()]
	const ensureArray = (item) => (Array.isArray(item) ? item : [item])

	const filteredData = applyFilters(
		ensureArray(queryData.data),
		filters,
		entityStatus
	)

	const result = {
		count: filteredData.length,
		result: filteredData,
	}

	res.json(result)
}

export default QueryEntityHandler
