import { AxiosInstance, AxiosResponse } from 'axios'

const ENDPOINTS = {
	tokens: '/tokens',
	associateFn: (tokenId: string): string => `/tokens/${tokenId}/associate`,
}

const save = async (api: AxiosInstance, accessToken: string, payload) => {
	const result = await api.post(ENDPOINTS.tokens, payload, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

const list = async (api: AxiosInstance, accessToken: string) => {
	const result = await api.get<{ data: Record<string, unknown> }>(
		ENDPOINTS.tokens,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return result.data
}

const associate = async (
	api: AxiosInstance,
	accessToken: string,
	tokenId: string
) => {
	const result = await api.put(ENDPOINTS.associateFn(tokenId), null, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result
}

export interface Tokens {
	save: (
		token: string,
		payload: Record<string, unknown>
	) => Promise<AxiosResponse<any>>
	list: (token: string) => Promise<Record<string, unknown>>
	associate: (token: string, tokenId: string) => Promise<AxiosResponse<any>>
}

const tokens = (api: AxiosInstance): Tokens => ({
	save: (token: string, payload: Record<string, unknown>) =>
		save(api, token, payload),
	list: (token: string) => list(api, token),
	associate: (token: string, tokenId: string) =>
		associate(api, token, tokenId),
})

export default tokens
