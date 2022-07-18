const ENDPOINTS = {
	tokens: '/tokens',
	associateFn: (tokenId) => `/tokens/${tokenId}/associate`,
}

const save = async (api, accessToken, payload) => {
	const result = await api.post(ENDPOINTS.tokens, payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const list = async (api, accessToken) => {
	const result = await api.get(ENDPOINTS.tokens, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data
}

const associate = async (api, accessToken, tokenId) => {
	const result = await api.put(ENDPOINTS.associateFn(tokenId), null, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const tokens = (api) => ({
	save: (token, payload) => save(api, token, payload),
	list: (token) => list(api, token),
	associate: (token, tokenId) => associate(api, token, tokenId),
})

export default tokens
