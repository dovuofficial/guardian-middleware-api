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

test('Expect that a request with no authorization header fails', async () => {
	const mockedApiRequest = MockedApiRequest.mock()
	const response = await handlerWithMiddleware(
		mockedApiRequest,
		mockedApiResponse
	)

	expect(response.error.message).toBe(
		withAuthenticationResponse.noAccessToken
	)
})

test('Expect that a request with a JWT is successfull', async () => {
	const mockedApiRequest = MockedApiRequest.mock({
		authorization: 'Bearer 123',
	})
	const response = await handlerWithMiddleware(
		mockedApiRequest,
		mockedApiResponse
	)

	expect(response).toBe('ok')
})
