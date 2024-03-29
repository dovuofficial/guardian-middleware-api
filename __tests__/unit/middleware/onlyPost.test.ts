// @ts-nocheck

// App imports
import Language from 'src/constants/language'
import onlyPost from 'src/middleware/onlyPost'

// Mocks
import MockedApiResponse from '@mocks/apiResponse'
import MockedApiRequest from '@mocks/apiRequest'

const { onlyPostResponse } = Language.middleware

const mockedHandler = () => 'ok'
const handlerWithMiddleware = onlyPost(mockedHandler)
const mockedApiResponse = MockedApiResponse.mock()

test('Expect that a request with a GET method fails', async () => {
	const mockedApiRequest = MockedApiRequest.mock()

	expect(() =>
		handlerWithMiddleware(mockedApiRequest, mockedApiResponse)
	).toThrowError(onlyPostResponse.notAllowed('GET'))
})

test('Expect that a request with a POST method succeeds', async () => {
	const mockedApiRequest = MockedApiRequest.mock({}, 'POST')
	const response = await handlerWithMiddleware(
		mockedApiRequest,
		mockedApiResponse
	)

	expect(response).toBe('ok')
})
