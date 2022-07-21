import { AxiosInstance, AxiosResponse } from 'axios'

const ENDPOINTS = {
	register: '/accounts/register',
	login: '/accounts/login',
	session: '/accounts/session',
}

export interface AccountRegisterResponse {
	username: string
	password: string
	did: string | null
	parent: string | null
	role: string
	id: string
}
const register = async (
	api: AxiosInstance,
	payload: Record<string, unknown>
) => {
	const result = await api.post<AccountRegisterResponse>(
		ENDPOINTS.register,
		payload
	)

	// This should be a 409 it shows a 200 for duplicate emails
	// console.log(result.status);

	return result.data
}
export interface AccountLoginResponse {
	username: string
	did: string
	role: string
	accessToken: string
}
const login = async (api: AxiosInstance, payload: Record<string, unknown>) => {
	const result = await api.post<AccountLoginResponse>(
		ENDPOINTS.login,
		payload
	)

	return result.data
}

const session = async (api: AxiosInstance, accessToken: string) => {
	const result = await api.get(ENDPOINTS.session, {
		headers: {
			Authorization: accessToken,
		},
	})

	return result
}

export interface Accounts {
	register: (
		payload: Record<string, unknown>
	) => Promise<AccountRegisterResponse>
	login: (payload: Record<string, unknown>) => Promise<AccountLoginResponse>
	session: (token: string) => Promise<AxiosResponse<any>>
}

const account = (api: AxiosInstance): Accounts => ({
	register: (payload: Record<string, unknown>) => register(api, payload),
	login: (payload: Record<string, unknown>) => login(api, payload),
	session: (token: string) => session(api, token),
})

export default account
