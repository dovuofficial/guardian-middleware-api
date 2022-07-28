import Status from 'src/constants/status'
import Config from 'src/config'
import Hmac from 'src/utils/hmac'
import axios from 'axios'
import Crypto from 'crypto'

const { webhookUrl } = Config
describe('Webhook', () => {
	it('cannot consumed with a GET request', async () => {
		if (!webhookUrl) {
			console.warn(
				"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		await expect(axios.get(webhookUrl)).rejects.toThrow(
			'Request failed with status code 405'
		)
	})

	it('has been hit, if a signature does not exist, return 401', async () => {
		if (!webhookUrl) {
			console.warn(
				"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		await expect(axios.post(webhookUrl)).rejects.toThrow(
			'Request failed with status code 401'
		)
	})

	it('has been hit, with a bad signature', async () => {
		if (!webhookUrl) {
			console.warn(
				"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		await expect(
			axios.post(
				webhookUrl,
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
		if (!webhookUrl) {
			console.warn(
				"Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed"
			)
			return
		}

		const mockRequestBody = { foo: 'bar', baz: 'qux', quux: 'corge' }

		var verb = 'POST'
		const url = new URL(webhookUrl)
		var host = url.host
		var path = url.pathname
		const date = new Date().toUTCString()
		const contentHash = Crypto.createHash('sha256')
			.update(JSON.stringify(mockRequestBody))
			.digest('base64')

		const stringToSign = `${verb}\n${path}\n${date};${host};${contentHash}`

		const signature = Hmac.generateHmac(stringToSign)

		const config = {
			headers: {
				'x-signature': signature,
				'x-date': date,
			},
		}

		const response = await axios.post(webhookUrl, mockRequestBody, config)
		expect(response.status).toBe(Status.OK)
	})
})
