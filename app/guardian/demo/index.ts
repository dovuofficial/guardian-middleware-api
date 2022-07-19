import { AxiosInstance } from 'axios'

const ENDPOINTS = {
	randomKey: '/demo/randomKey',
}

const randomKey = async (api: AxiosInstance) => {
	const result = await api.get<Record<string, unknown>>(ENDPOINTS.randomKey)

	return result.data
}

const demo = (api: AxiosInstance) => ({
	randomKey: () => randomKey(api),
})

export default demo
