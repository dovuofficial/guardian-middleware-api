import { AxiosInstance } from 'axios'

const ENDPOINTS = {
	randomKey: '/demo/randomKey',
}

const randomKey = async (api: AxiosInstance) => {
	const result = await api.get<Record<string, unknown>>(ENDPOINTS.randomKey)

	return result.data
}

export interface Demo {
	randomKey: () => Promise<Record<string, unknown>>
}

const demo = (api: AxiosInstance): Demo => ({
	randomKey: () => randomKey(api),
})

export default demo
