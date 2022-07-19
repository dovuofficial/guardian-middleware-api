// Mocked request for setting headers

const mockedApiRequest = {
	mock: (
		headers = {},
		method = 'GET'
	): { headers: Record<string, unknown>; method: string } => ({
		headers,
		method,
	}),
}

export default mockedApiRequest
