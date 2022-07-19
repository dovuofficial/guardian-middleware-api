import { AxiosInstance } from 'axios'

const ENDPOINTS = {
	register: '/accounts/register',
	login: '/accounts/login',
	session: '/accounts/session',
}

const register = async (
	api: AxiosInstance,
	payload: Record<string, unknown>
) => {
	const result = await api.post<Record<string, unknown>>(
		ENDPOINTS.register,
		payload
	)

	// This should be a 409 it shows a 200 for duplicate emails
	// console.log(result.status);

	return result.data
}

const login = async (api: AxiosInstance, payload: Record<string, unknown>) => {
	const result = await api.post<Record<string, unknown>>(
		ENDPOINTS.login,
		payload
	)

	console.log(result.status)

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

const account = (api: AxiosInstance) => ({
	register: (payload: Record<string, unknown>) => register(api, payload),
	login: (payload: Record<string, unknown>) => login(api, payload),
	session: (token: string) => session(api, token),
})

export default account
