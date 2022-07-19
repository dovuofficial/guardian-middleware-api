import { AxiosInstance } from 'axios'

const ENDPOINTS = {
	profile: '/profiles/',
}

const save = async (
	api: AxiosInstance,
	accessToken: string,
	payload: Record<string, unknown>,
	username: string
) => {
	const result = await api.put(ENDPOINTS.profile + username, payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const fetch = async (
	api: AxiosInstance,
	accessToken: string,
	username: string
) => {
	//TODO: Dunno if we need null for payload for GET
	const result = await api.get<Record<string, unknown>>(
		ENDPOINTS.profile + username,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return result.data
}

const profile = (api: AxiosInstance) => ({
	save: (token: string, payload: Record<string, unknown>, username: string) =>
		save(api, token, payload, username),
	fetch: (token: string, username: string) => fetch(api, token, username),
})

export default profile
