import { AxiosInstance } from 'axios'

const ENDPOINTS = {
	schemas: '/schemas',
	createFn: (topicId: string) => `/schemas/${topicId}`,
	publishFn: (schemaId: string) => `/schemas/${schemaId}/publish`,
}

const create = async (
	api: AxiosInstance,
	accessToken: string,
	payload: Record<string, unknown>,
	topicId: string
) => {
	const result = await api.post<Array<Record<string, unknown>>>(
		ENDPOINTS.createFn(topicId),
		payload,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	// Return the schema object that was just created. Not every single schema!
	const { data } = result
	return data[data.length - 1]
}

const publish = async (
	api: AxiosInstance,
	accessToken: string,
	schemaId: string,
	payload: Record<string, unknown>
) => {
	const result = await api.put(ENDPOINTS.publishFn(schemaId), payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const update = async (
	api: AxiosInstance,
	accessToken: string,
	payload: Record<string, unknown>
) => {
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

const all = async (api: AxiosInstance, accessToken: string) => {
	const { data } = await api.get<Array<Record<string, unknown>>>(
		ENDPOINTS.schemas,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return data
}

const schemas = (api: AxiosInstance) => ({
	create: (
		token: string,
		payload: Record<string, unknown>,
		topicId: string
	) => create(api, token, payload, topicId),
	publish: (
		token: string,
		schemaId: string,
		payload: Record<string, unknown>
	) => publish(api, token, schemaId, payload),
	update: (token: string, payload: Record<string, unknown>) =>
		update(api, token, payload),
	all: (token: string) => all(api, token),
})

export default schemas
