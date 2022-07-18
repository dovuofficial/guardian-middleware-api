const ENDPOINTS = {
	profile: '/profiles/',
}

const save = async (api, accessToken, payload, username) => {
	const result = await api.put(ENDPOINTS.profile + username, payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const fetch = async (api, accessToken, username) => {
	//TODO: Dunno if we need null for payload for GET
	const result = await api.get(ENDPOINTS.profile + username, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data
}

const profile = (api) => ({
	save: (token, payload, username) => save(api, token, payload, username),
	fetch: (token, username) => fetch(api, token, username),
})

export default profile
