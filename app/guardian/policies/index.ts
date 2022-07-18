const ENDPOINTS = {
	policies: '/policies',
	import: '/policies/import/file',
	publishFn: (policyId) => `/policies/${policyId}/publish`,
	updateFn: (policyId) => `/policies/${policyId}`,
	blocksFn: (policyId) => `/policies/${policyId}/blocks`,
	blockByIdFn: (policyId, uuid) => `/policies/${policyId}/blocks/${uuid}`,
	blockByTagFn: (policyId, tag) => `/policies/${policyId}/tag/${tag}`,
}

const importFile = async (api, accessToken, file) => {
	const result = await api.post(ENDPOINTS.import, file, {
		headers: {
			'Content-Type': 'binary/octet-stream',
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const publish = async (api, accessToken, policyId, payload) => {
	const result = await api.put(ENDPOINTS.publishFn(policyId), payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const update = async (api, accessToken, policyId, payload) => {
	const result = await api.put(ENDPOINTS.updateFn(policyId), payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const list = async (api, accessToken) => {
	const result = await api.get(ENDPOINTS.policies, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data
}

const policyByName = async (api, accessToken, name) => {
	const policies = await list(api, accessToken)
	const policy = policies.find((policy) => policy.name === name)

	if (!policy) {
		throw new Error('Policy was not found by name')
	}

	return policy
}

const blocks = async (api, accessToken, policyId) => {
	const result = await api.get(ENDPOINTS.blocksFn(policyId), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data
}

const blockById = async (api, accessToken, policyId, uuid) => {
	const result = await api.get(ENDPOINTS.blockByIdFn(policyId, uuid), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data
}

const blockByTag = async (api, accessToken, policyId, tag) => {
	const result = await api.get(ENDPOINTS.blockByTagFn(policyId, tag), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data.id
}

const sendToBlock = async (api, accessToken, policyId, uuid, payload) => {
	const result = await api.post(
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

const policies = (api) => ({
	importFile: (token, payload) => importFile(api, token, payload),
	publish: (token, policyId, payload) =>
		publish(api, token, policyId, payload),
	update: (token, policyId, payload) => update(api, token, policyId, payload),
	list: (token) => list(api, token),
	blocks: (token, policyId) => blocks(api, token, policyId),
	blockByTag: (token, policyId, tag) => blockByTag(api, token, policyId, tag),
	policyByName: (token, name) => policyByName(api, token, name),
	blockById: (token, policyId, uuid) => blockById(api, token, policyId, uuid),
	sendToBlock: (token, policyId, uuid, payload) =>
		sendToBlock(api, token, policyId, uuid, payload),
})

export default policies
