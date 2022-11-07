import { AxiosInstance } from 'axios'

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

const register = async (api: AxiosInstance, payload: CreateAccountDto) => {
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

const login = async (api: AxiosInstance, payload: LoginCredentialsDto) => {
	const result = await api.post<AccountLoginResponse>(
		ENDPOINTS.login,
		payload
	)

	return result.data
}

export interface SessionResponse {
	username: string
	password: string
	did: string | null
	parent: string | null
	role: string
	id: string
	hederaAccountId: string | null
}

const session = async (api: AxiosInstance, accessToken: string) => {
	const result = await api.get<SessionResponse>(ENDPOINTS.session, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return result.data
}
interface LoginCredentialsDto {
	username: string
	password: string
}

export interface CreateAccountDto {
	username: string
	password: string
	role: 'USER'
}
export interface Accounts {
	register: (payload: CreateAccountDto) => Promise<AccountRegisterResponse>
	login: (payload: LoginCredentialsDto) => Promise<AccountLoginResponse>
	session: (token: string) => Promise<SessionResponse>
}

const account = (api: AxiosInstance): Accounts => ({
	register: (payload) => register(api, payload),
	login: (payload) => login(api, payload),
	session: (token) => session(api, token),
})

export default account
