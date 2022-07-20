// Mocked request handler for dealing with status and send

class mockedApiResponse {
	static mock() {
		return new mockedApiResponse()
	}

	status(_status: number) {
		return this
	}

	send(body: Record<string, unknown>) {
		return body
	}
}

export default mockedApiResponse
