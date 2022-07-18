const ENDPOINTS = {
	register: '/accounts/register',
	login: '/accounts/login',
	session: '/accounts/session',
}

const register = async (api, payload) => {
	const result = await api.post(ENDPOINTS.register, payload)

	// This should be a 409 it shows a 200 for duplicate emails
	// console.log(result.status);

	return result.data
}

const login = async (api, payload) => {
	const result = await api.post(ENDPOINTS.login, payload)

	console.log(result.status)

	return result.data
}

const session = async (api, accessToken) => {
	const result = await api.get(ENDPOINTS.session, {
		headers: {
			Authorization: accessToken,
		},
	})

	return result
}

const account = (api) => ({
	register: (payload) => register(api, payload),
	login: (payload) => login(api, payload),
	session: (token) => session(api, token),
})

export default account
