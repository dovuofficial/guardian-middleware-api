const ENDPOINTS = {
	schemas: '/schemas',
	createFn: (topicId) => `/schemas/${topicId}`,
	publishFn: (schemaId) => `/schemas/${schemaId}/publish`,
}

const create = async (api, accessToken, payload, topicId) => {
	const result = await api.post(ENDPOINTS.createFn(topicId), payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	// Return the schema object that was just created. Not every single schema!
	const { data } = result
	return data[data.length - 1]
}

const publish = async (api, accessToken, schemaId, payload) => {
	const result = await api.put(ENDPOINTS.publishFn(schemaId), payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const update = async (api, accessToken, payload) => {
	if (!payload.id) {
		throw new Error('Schema update payload is missing an `id`')
	}

	const result = await api.put(ENDPOINTS.schemas, payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const all = async (api, accessToken) => {
	const { data } = await api.get(ENDPOINTS.schemas, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return data
}

const schemas = (api) => ({
	create: (token, payload, topicId) => create(api, token, payload, topicId),
	publish: (token, schemaId, payload) =>
		publish(api, token, schemaId, payload),
	update: (token, payload) => update(api, token, payload),
	all: (token) => all(api, token),
})

export default schemas
