import { AxiosInstance, AxiosResponse } from 'axios'

export interface BlockData {
	data?: BlockData[] // Feels naughty 👹
	hash?: string
	id: string
	uiMetaData: { title: string; description: string }
	blocks?: Array<{ id: string }>
	roles?: Array<string>
	blockType: string
	owner?: string
	option?: {
		status: string
	}
	schema?: {
		type: string
		contextURL: string
		fields: Array<{
			title: string
			name: string
			type: string
			isRef: boolean
			required: boolean
		}>
	}
}

const ENDPOINTS = {
	policies: '/policies',
	import: '/policies/import/file',
	publishFn: (policyId: string) => `/policies/${policyId}/publish`,
	updateFn: (policyId: string) => `/policies/${policyId}`,
	blocksFn: (policyId: string) => `/policies/${policyId}/blocks`,
	policyInfoByIdFn: (policyId: string) =>
		`/policies/${policyId}`,
	blockByIdFn: (policyId: string, uuid: string) =>
		`/policies/${policyId}/blocks/${uuid}`,
	blockByTagFn: (policyId: string, tag: string) =>
		`/policies/${policyId}/tag/${tag}`,
}

const importFile = async (api: AxiosInstance, accessToken: string, file) => {
	const result = await api.post(ENDPOINTS.import, file, {
		headers: {
			'Content-Type': 'binary/octet-stream',
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const publish = async (
	api: AxiosInstance,
	accessToken: string,
	policyId: string,
	payload: Record<string, unknown>
) => {
	const result = await api.put(ENDPOINTS.publishFn(policyId), payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const update = async (
	api: AxiosInstance,
	accessToken: string,
	policyId: string,
	payload: Record<string, unknown>
) => {
	const result = await api.put(ENDPOINTS.updateFn(policyId), payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const list = async (api: AxiosInstance, accessToken: string) => {
	const result = await api.get<Array<Record<string, unknown>>>(
		ENDPOINTS.policies,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return result.data
}

const fetchSinglePolicy = async (api: AxiosInstance, accessToken: string, id: string) => {
	const result = await api.get<Record<string, unknown>>(
		ENDPOINTS.policyInfoByIdFn(id),
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return result.data
}

const policyById = async (api: AxiosInstance, accessToken: string, id) => {
	const policy = await fetchSinglePolicy(api, accessToken, id)

	if (!policy) {
		throw new Error('Policy was not found by id')
	}

	return policy
}

const policyByName = async (api: AxiosInstance, accessToken: string, name) => {
	const policies = await list(api, accessToken)
	const policy = policies.find((p) => p.name === name)

	if (!policy) {
		throw new Error('Policy was not found by name')
	}

	return policy
}

const blocks = async (
	api: AxiosInstance,
	accessToken: string,
	policyId: string
) => {
	const result = await api.get<{ id: string }>(ENDPOINTS.blocksFn(policyId), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data
}

const blockById = async (
	api: AxiosInstance,
	accessToken: string,
	policyId: string,
	uuid: string
) => {
	const result = await api.get<BlockData>(
		ENDPOINTS.blockByIdFn(policyId, uuid),
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return result.data
}

const blockByTag = async (
	api: AxiosInstance,
	accessToken: string,
	policyId: string,
	tag: string
): Promise<string> => {
	const result = await api.get<{ id: string }>(
		ENDPOINTS.blockByTagFn(policyId, tag),
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return result.data.id
}

const sendToBlock = async (
	api: AxiosInstance,
	accessToken: string,
	policyId: string,
	uuid: string,
	payload: Record<string, unknown>
) => {
	const result = await api.post<Record<string, unknown>>(
		ENDPOINTS.blockByIdFn(policyId, uuid),
		payload,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return result.data
}

export interface Policies {
	importFile: (token: string, payload: any) => Promise<AxiosResponse<any>>
	publish: (
		token: string,
		policyId: string,
		payload: Record<string, unknown>
	) => Promise<AxiosResponse<any>>
	update: (
		token: string,
		policyId: string,
		payload: Record<string, unknown>
	) => Promise<AxiosResponse<any>>
	list: (token: string) => Promise<Record<string, unknown>[]>
	blocks: (token: string, policyId: string) => Promise<{ id: string }>
	blockByTag: (
		token: string,
		policyId: string,
		tag: string
	) => Promise<string>
	policyByName: (
		token: string,
		name: string
	) => Promise<Record<string, unknown>>
	policyById: (
		token: string,
		id: string
	) => Promise<Record<string, unknown>>
	blockById: (
		token: string,
		policyId: string,
		uuid: string
	) => Promise<BlockData>
	sendToBlock: (
		token: string,
		policyId: string,
		uuid: string,
		payload: Record<string, unknown>
	) => Promise<Record<string, unknown>>
}

const policies = (api: AxiosInstance): Policies => ({
	importFile: (token, payload) => importFile(api, token, payload),
	publish: (token, policyId, payload) =>
		publish(api, token, policyId, payload),
	update: (token, policyId, payload) => update(api, token, policyId, payload),
	list: (token) => list(api, token),
	blocks: (token, policyId) => blocks(api, token, policyId),
	blockByTag: (token, policyId, tag) => blockByTag(api, token, policyId, tag),
	policyByName: (token, name) => policyByName(api, token, name),
	policyById: (token, id) => policyById(api, token, id),
	blockById: (token, policyId, uuid) => blockById(api, token, policyId, uuid),
	sendToBlock: (token, policyId, uuid, payload) =>
		sendToBlock(api, token, policyId, uuid, payload),
})

export default policies
