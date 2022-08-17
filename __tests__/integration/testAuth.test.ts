import StatusCode from 'src/constants/status'
import Config from 'src/config'
import { generateHeaders, generateHmac } from 'src/utils/hmac'
import axios from 'axios'
import Crypto from 'crypto'
import config from 'src/config'

const { testAuthUrl } = Config
describe('Test authentication route', () => {
	it('has been hit, if a signature does not exist, return 401', async () => {
		if (!testAuthUrl) {
			console.warn(
				"Skipping test as 'TEST_AUTH_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		await expect(axios.post(testAuthUrl)).rejects.toThrow(
			'Request failed with status code 401'
		)
	})

	it('has been hit, with a bad signature', async () => {
		if (!testAuthUrl) {
			console.warn(
				"Skipping test as 'TEST_AUTH_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		await expect(
			axios.post(
				testAuthUrl,
				{},
				{
					headers: {
						'x-signature': '123',
					},
				}
			)
		).rejects.toThrow('Request failed with status code 401')
	})

	it('has been hit, with a good signature and body', async () => {
		if (!testAuthUrl) {
			console.warn(
				"Skipping test as 'TEST_AUTH_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		const mockRequestBody = { foo: 'bar', baz: 'qux', quux: 'corge' }

		const headers = generateHeaders(
			'POST',
			config.hmacAuthKey,
			testAuthUrl,
			mockRequestBody
		)

		const response = await axios.post(testAuthUrl, mockRequestBody, {
			headers,
		})

		expect(response.status).toBe(StatusCode.OK)
	})

	it('with GET request', async () => {
		if (!testAuthUrl) {
			console.warn(
				"Skipping test as 'TEST_AUTH_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		const headers = generateHeaders('GET', config.hmacAuthKey, testAuthUrl)

		const response = await axios.get(testAuthUrl, { headers })

		expect(response.status).toBe(StatusCode.OK)
	})
})
