const ENDPOINTS = {
	randomKey: '/demo/randomKey',
}

const randomKey = async (api) => {
	const result = await api.get(ENDPOINTS.randomKey)

	return result.data
}

const demo = (api) => ({
	randomKey: () => randomKey(api),
})

export default demo
