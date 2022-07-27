// @ts-nocheck
// App imports
import Config from 'src/config'
import Language from 'src/constants/language'
import withAuthentication from 'src/middleware/withAuthentication'

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

	expect(response.error.message).toBe(withAuthenticationResponse.noApikey)
})

test('Expect that a request with an invalid api key fails', async () => {
	const mockedApiRequest = MockedApiRequest.mock({ 'x-api-key': 'bad-key' })
	const response = await handlerWithMiddleware(
		mockedApiRequest,
		mockedApiResponse
	)

	expect(response.error.message).toBe(
		withAuthenticationResponse.invalidApikey
	)
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
