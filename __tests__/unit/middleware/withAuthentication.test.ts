// App imports
import Config from '@lib/config'
import Language from '@lib/constants/language'
import withAuthentication from '@lib/middleware/withAuthentication'

// Mocks
import MockedApiResponse from '@mocks/apiResponse'
import MockedApiRequest from '@mocks/apiRequest'

const { withAuthenticationResponse } = Language.middleware

const mockedHandler = () => 'ok'
const handlerWithMiddleware = withAuthentication(mockedHandler)
const mockedApiResponse = MockedApiResponse.mock()

test('Expect that a request with no api key fails', async () => {
	const mockedApiRequest = MockedApiRequest.mock()
	const response = await handlerWithMiddleware(
		mockedApiRequest,
		mockedApiResponse
	)

	expect(response.message).toBe(withAuthenticationResponse.noApikey)
})

test('Expect that a request with an invalid api key fails', async () => {
	const mockedApiRequest = MockedApiRequest.mock({ 'x-api-key': 'bad-key' })
	const response = await handlerWithMiddleware(
		mockedApiRequest,
		mockedApiResponse
	)

	expect(response.message).toBe(withAuthenticationResponse.invalidApikey)
})

test('Expect that a request with a valid api key is successfull', async () => {
	const mockedApiRequest = MockedApiRequest.mock({
		'x-api-key': Config.authenticationKey,
	})
	const response = await handlerWithMiddleware(
		mockedApiRequest,
		mockedApiResponse
	)

	expect(response).toBe('ok')
})
