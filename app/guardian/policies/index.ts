import { AxiosInstance } from 'axios'

export interface BlockData {
	id: string
	uiMetaData: { title: string; description: string }
	blocks?: Array<{ id: string }>
	roles?: Array<string>
	blockType: string
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

const policyByName = async (api: AxiosInstance, accessToken: string, name) => {
	const policies = await list(api, accessToken)
	const policy = policies.find((policy) => policy.name === name)

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

	console.log(result.data)

	return result.data
}

const policies = (api: AxiosInstance) => ({
	importFile: (token: string, payload: Record<string, unknown>) =>
		importFile(api, token, payload),
	publish: (
		token: string,
		policyId: string,
		payload: Record<string, unknown>
	) => publish(api, token, policyId, payload),
	update: (
		token: string,
		policyId: string,
		payload: Record<string, unknown>
	) => update(api, token, policyId, payload),
	list: (token: string) => list(api, token),
	blocks: (token: string, policyId: string) => blocks(api, token, policyId),
	blockByTag: (token: string, policyId: string, tag: string) =>
		blockByTag(api, token, policyId, tag),
	policyByName: (token: string, name: string) =>
		policyByName(api, token, name),
	blockById: (token: string, policyId: string, uuid: string) =>
		blockById(api, token, policyId, uuid),
	sendToBlock: (
		token: string,
		policyId: string,
		uuid: string,
		payload: Record<string, unknown>
	) => sendToBlock(api, token, policyId, uuid, payload),
})

export default policies
