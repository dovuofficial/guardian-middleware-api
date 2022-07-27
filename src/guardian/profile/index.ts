import { AxiosInstance, AxiosResponse } from 'axios'

const ENDPOINTS = {
	profile: '/profiles/',
}

const save = async (
	api: AxiosInstance,
	accessToken: string,
	payload: HederaProfileDto,
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

export interface HederaProfileDto {
	hederaAccountId: string
	hederaAccountKey: string
}

export interface Profile {
	save: (
		token: string,
		payload: HederaProfileDto,
		username: string
	) => Promise<AxiosResponse<any>>
	fetch: (token: string, username: string) => Promise<Record<string, unknown>>
}

const profile = (api: AxiosInstance): Profile => ({
	save: (token, payload, username) => save(api, token, payload, username),
	fetch: (token, username) => fetch(api, token, username),
})

export default profile
